import { NextResponse } from "next/server";
import { getAuthenticatedUid } from "@/lib/cloudinary/auth";
import {
  getCloudinaryConfig,
  getUserUploadFolder,
  signCloudinaryParams,
} from "@/lib/cloudinary/server";

export const runtime = "nodejs";

const RESOURCE_TYPES = new Set(["image", "raw", "video"]);

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
    type?: unknown;
  } | null;

  if (
    !body ||
    typeof body.publicId !== "string" ||
    body.publicId.length === 0 ||
    body.publicId.length > 500
  ) {
    return NextResponse.json(
      { error: "A valid file id is required." },
      { status: 400 },
    );
  }

  const resourceType =
    typeof body.resourceType === "string" &&
    RESOURCE_TYPES.has(body.resourceType)
      ? body.resourceType
      : "image";
  const deliveryType = body.type === "upload" ? "upload" : "private";

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
    const invalidate = "true";
    const signature = signCloudinaryParams({
      invalidate,
      public_id: body.publicId,
      timestamp,
      type: deliveryType,
    });

    const form = new URLSearchParams({
      public_id: body.publicId,
      timestamp: String(timestamp),
      invalidate,
      type: deliveryType,
      api_key: apiKey,
      signature,
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form,
        cache: "no-store",
      },
    );
    const result = (await response.json().catch(() => null)) as {
      result?: string;
    } | null;

    if (
      !response.ok ||
      (result?.result !== "ok" && result?.result !== "not found")
    ) {
      console.error(
        "Cloudinary file deletion failed:",
        response.status,
        result?.result,
      );
      return NextResponse.json(
        { error: "The file could not be removed from storage." },
        { status: 502 },
      );
    }

    return NextResponse.json({ result: result.result });
  } catch (error) {
    console.error("Cloudinary file deletion failed:", error);
    return NextResponse.json(
      { error: "The file could not be removed from storage." },
      { status: 503 },
    );
  }
}
