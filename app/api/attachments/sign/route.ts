import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthenticatedUid } from "@/lib/cloudinary/auth";
import {
  getCloudinaryConfig,
  getUserUploadFolder,
  signCloudinaryParams,
} from "@/lib/cloudinary/server";

export const runtime = "nodejs";

const ALLOWED_FORMATS = "pdf,jpg,jpeg,png,webp";
const DELIVERY_TYPE = "private";

export async function POST(request: Request) {
  const uid = await getAuthenticatedUid(request);
  if (!uid) {
    return NextResponse.json(
      { error: "A valid signed-in session is required." },
      { status: 401 },
    );
  }

  try {
    const { cloudName, apiKey } = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = getUserUploadFolder(uid);
    const publicId = randomUUID();
    const signature = signCloudinaryParams({
      allowed_formats: ALLOWED_FORMATS,
      folder,
      public_id: publicId,
      timestamp,
      type: DELIVERY_TYPE,
    });

    return NextResponse.json({
      apiKey,
      cloudName,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      timestamp,
      folder,
      publicId,
      allowedFormats: ALLOWED_FORMATS,
      type: DELIVERY_TYPE,
      signature,
    });
  } catch (error) {
    console.error("Cloudinary upload signing failed:", error);
    return NextResponse.json(
      { error: "File storage is not configured." },
      { status: 503 },
    );
  }
}
