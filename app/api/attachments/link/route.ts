import { NextResponse } from "next/server";
import { getAuthenticatedUid } from "@/lib/cloudinary/auth";
import {
  getCloudinaryConfig,
  getUserUploadFolder,
  signCloudinaryParams,
} from "@/lib/cloudinary/server";

export const runtime = "nodejs";

const LINK_TTL_SECONDS = 15 * 60;
const RESOURCE_TYPES = new Set(["image", "raw", "video"]);
const FORMATS = new Set(["pdf", "jpg", "jpeg", "png", "webp"]);

export async function POST(request: Request) {
  const uid = await getAuthenticatedUid(request);
  if (!uid) {
    return NextResponse.json(
      { error: "A valid signed-in session is required." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    publicId?: unknown;
    resourceType?: unknown;
    format?: unknown;
    attachment?: unknown;
  } | null;

  if (
    !body ||
    typeof body.publicId !== "string" ||
    body.publicId.length === 0 ||
    body.publicId.length > 500 ||
    typeof body.format !== "string" ||
    !FORMATS.has(body.format.toLowerCase())
  ) {
    return NextResponse.json(
      { error: "Valid file details are required." },
      { status: 400 },
    );
  }

  const resourceType =
    typeof body.resourceType === "string" &&
    RESOURCE_TYPES.has(body.resourceType)
      ? body.resourceType
      : "image";
  const format = body.format.toLowerCase();
  const attachment = body.attachment === true;

  const folderPrefix = `${getUserUploadFolder(uid)}/`;
  if (
    !body.publicId.startsWith(folderPrefix) ||
    body.publicId.includes("..") ||
    body.publicId.includes("\\")
  ) {
    return NextResponse.json(
      { error: "This file does not belong to your account." },
      { status: 403 },
    );
  }

  try {
    const { cloudName, apiKey } = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const expiresAt = timestamp + LINK_TTL_SECONDS;
    const params: Record<string, string | number> = {
      expires_at: expiresAt,
      format,
      public_id: body.publicId,
      timestamp,
    };
    if (attachment) params.attachment = "true";

    const signature = signCloudinaryParams(params);
    const url = new URL(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/download`,
    );
    Object.entries(params).forEach(([name, value]) => {
      url.searchParams.set(name, String(value));
    });
    url.searchParams.set("signature", signature);
    url.searchParams.set("api_key", apiKey);

    return NextResponse.json(
      { url: url.toString(), expiresAt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Cloudinary download link generation failed:", error);
    return NextResponse.json(
      { error: "A download link could not be created." },
      { status: 503 },
    );
  }
}
