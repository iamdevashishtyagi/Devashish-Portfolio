import { NextResponse } from "next/server";
import { uploadAvatarToCloudinary, isCloudinaryConfigured } from "@/src/app/lib/cloudinary";
import { getClientIp, hashIdentifier, checkRateLimit } from "@/src/app/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipHash = hashIdentifier(ip);

    // Rate-limit: Max 5 uploads per IP per 10 minutes
    const rateLimit = checkRateLimit(`upload_${ipHash}`, 5, 600);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many upload requests. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image format. Please select a valid photo." },
        { status: 400 }
      );
    }

    // Attempt Cloudinary upload if configured
    if (isCloudinaryConfigured()) {
      const result = await uploadAvatarToCloudinary(image);
      if (result && result.url) {
        return NextResponse.json({
          url: result.url,
          isCloudinary: true,
        });
      }
    }

    // Graceful fallback if Cloudinary credentials are not yet set
    return NextResponse.json({
      url: image,
      isCloudinary: false,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}
