import type { User } from "firebase/auth";
import type { JobAttachment } from "@/lib/types/attachment";
import { toBnDigits } from "@/lib/utils/bn";

export const MAX_ATTACHMENT_COUNT = 8;
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const ATTACHMENT_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";

const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp"];

interface UploadSignature {
  apiKey: string;
  cloudName: string;
  uploadUrl: string;
  timestamp: number;
  folder: string;
  publicId: string;
  allowedFormats: string;
  type: string;
  signature: string;
}

interface CloudinaryUploadResult {
  public_id?: string;
  resource_type?: string;
  type?: string;
  format?: string;
  bytes?: number;
  original_filename?: string;
  error?: { message?: string };
}

function getExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

async function getIdToken(user: User): Promise<string> {
  try {
    return await user.getIdToken();
  } catch {
    throw new Error("লগইন সেশন শেষ হয়েছে। আবার লগইন করে চেষ্টা করুন।");
  }
}

export function isAllowedAttachment(file: File): boolean {
  return ALLOWED_EXTENSIONS.includes(getExtension(file.name));
}

export function validateAttachmentSelection(
  files: File[],
  existingCount: number,
): string | null {
  if (existingCount + files.length > MAX_ATTACHMENT_COUNT) {
    return `একটি আবেদনে সর্বোচ্চ ${toBnDigits(MAX_ATTACHMENT_COUNT)}টি ফাইল সংযুক্ত করা যাবে।`;
  }

  for (const file of files) {
    if (!isAllowedAttachment(file)) {
      return `“${file.name}” সমর্থিত নয়। শুধু PDF, JPG, PNG বা WebP ফাইল দিন।`;
    }
    if (file.size === 0) {
      return `“${file.name}” ফাইলটি খালি।`;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return `“${file.name}” ফাইলটি ১০ MB-এর বেশি। ছোট ফাইল বেছে নিন।`;
    }
  }

  return null;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "০ KB";
  if (bytes < 1024 * 1024) {
    return `${toBnDigits(Math.max(1, Math.round(bytes / 1024)))} KB`;
  }
  const megabytes = (bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "");
  return `${toBnDigits(megabytes)} MB`;
}

async function readApiError(response: Response): Promise<string | null> {
  try {
    const payload = (await response.json()) as { error?: unknown };
    return typeof payload.error === "string" ? payload.error : null;
  } catch {
    return null;
  }
}

function uploadErrorMessage(status: number): string {
  if (status === 401) {
    return "লগইন সেশন শেষ হয়েছে। আবার লগইন করে চেষ্টা করুন।";
  }
  if (status === 413) {
    return "ফাইলটি অনেক বড়। ছোট ফাইল বেছে নিন।";
  }
  if (status === 503) {
    return "ফাইল সংরক্ষণ সেবা এখন উপলব্ধ নয়। কিছুক্ষণ পরে চেষ্টা করুন।";
  }
  return "ফাইল আপলোড করা যায়নি, আবার চেষ্টা করুন।";
}

export async function uploadJobAttachment(
  file: File,
  user: User,
): Promise<JobAttachment> {
  const token = await getIdToken(user);

  let signatureResponse: Response;
  try {
    signatureResponse = await fetch("/api/attachments/sign", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "ফাইল সংরক্ষণ সেবার সঙ্গে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ যাচাই করুন।",
    );
  }

  if (!signatureResponse.ok) {
    const detail = await readApiError(signatureResponse);
    console.error("Attachment signing failed:", detail);
    throw new Error(uploadErrorMessage(signatureResponse.status));
  }

  const signature = (await signatureResponse.json()) as UploadSignature;
  if (
    !signature.apiKey ||
    !signature.uploadUrl ||
    !signature.folder ||
    !signature.publicId ||
    !signature.allowedFormats ||
    !signature.type ||
    !signature.signature
  ) {
    throw new Error("ফাইল সংরক্ষণ সেবা সঠিকভাবে কনফিগার করা নেই।");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", String(signature.timestamp));
  form.append("folder", signature.folder);
  form.append("public_id", signature.publicId);
  form.append("allowed_formats", signature.allowedFormats);
  form.append("type", signature.type);
  form.append("signature", signature.signature);

  let uploadResponse: Response;
  try {
    uploadResponse = await fetch(signature.uploadUrl, {
      method: "POST",
      body: form,
    });
  } catch {
    throw new Error(
      "ফাইল আপলোড করা যায়নি। ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।",
    );
  }

  const uploaded = (await uploadResponse.json().catch(() => null)) as
    | CloudinaryUploadResult
    | null;

  const format = (uploaded?.format || getExtension(file.name)).toLowerCase();
  if (
    !uploadResponse.ok ||
    !uploaded?.public_id ||
    !uploaded.public_id.startsWith(`${signature.folder}/`) ||
    !format
  ) {
    console.error(
      "Cloudinary upload failed:",
      uploadResponse.status,
      uploaded?.error?.message,
    );
    throw new Error(uploadErrorMessage(uploadResponse.status));
  }

  return {
    public_id: uploaded.public_id,
    resource_type: uploaded.resource_type || "image",
    type: uploaded.type || signature.type,
    format,
    bytes: uploaded.bytes ?? file.size,
    original_filename: uploaded.original_filename || file.name,
    uploaded_at: new Date().toISOString(),
  };
}

export async function requestAttachmentUrl(
  attachment: JobAttachment,
  user: User,
  asAttachment: boolean,
): Promise<string> {
  const token = await getIdToken(user);
  let response: Response;

  try {
    response = await fetch("/api/attachments/link", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicId: attachment.public_id,
        resourceType: attachment.resource_type,
        format: attachment.format,
        attachment: asAttachment,
      }),
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "ফাইল খোলার লিংক তৈরি করা যায়নি। ইন্টারনেট সংযোগ যাচাই করুন।",
    );
  }

  if (!response.ok) {
    const detail = await readApiError(response);
    console.error("Attachment link generation failed:", detail);
    throw new Error(
      response.status === 401
        ? "লগইন সেশন শেষ হয়েছে। আবার লগইন করে চেষ্টা করুন।"
        : "ফাইল খোলার লিংক তৈরি করা যায়নি, আবার চেষ্টা করুন।",
    );
  }

  const payload = (await response.json()) as { url?: unknown };
  if (typeof payload.url !== "string") {
    throw new Error("ফাইল খোলার লিংক তৈরি করা যায়নি, আবার চেষ্টা করুন।");
  }
  return payload.url;
}

export async function deleteJobAttachment(
  attachment: JobAttachment,
  user: User,
): Promise<void> {
  const token = await getIdToken(user);
  let response: Response;
  try {
    response = await fetch("/api/attachments/delete", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicId: attachment.public_id,
        resourceType: attachment.resource_type,
        type: attachment.type || "private",
      }),
      cache: "no-store",
    });
  } catch {
    throw new Error("সংযুক্ত ফাইলটি মোছা যায়নি। ইন্টারনেট সংযোগ যাচাই করুন।");
  }

  if (!response.ok) {
    const detail = await readApiError(response);
    throw new Error(detail || "সংযুক্ত ফাইলটি মোছা যায়নি।");
  }
}
