import { createHash } from "node:crypto";

const DEFAULT_FOLDER = "job-tracker";

type CloudinaryParamValue = string | number;

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  return { cloudName, apiKey, apiSecret };
}

export function getUserUploadFolder(uid: string): string {
  const root = (process.env.CLOUDINARY_FOLDER || DEFAULT_FOLDER)
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/{2,}/g, "/");
  return `${root}/users/${uid}`;
}

export function signCloudinaryParams(
  params: Record<string, CloudinaryParamValue>,
): string {
  const { apiSecret } = getCloudinaryConfig();
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}
