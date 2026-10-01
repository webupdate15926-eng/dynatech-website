import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

import { getCloudinaryRawPdfPublicId } from "@/lib/cloudinary-pdf";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const source = request.nextUrl.searchParams.get("url") ?? "";

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "PDF delivery is not configured." }, { status: 503 });
  }

  const publicId = getCloudinaryRawPdfPublicId(source, cloudName);
  if (!publicId) {
    return NextResponse.json({ error: "Invalid PDF URL." }, { status: 400 });
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  const signedUrl = cloudinary.utils.private_download_url(publicId, "", {
    resource_type: "raw",
    type: "upload",
    attachment: false,
    expires_at: Math.floor(Date.now() / 1000) + 300,
  });

  return NextResponse.redirect(signedUrl, { status: 307 });
}
