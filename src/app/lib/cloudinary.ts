import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Upload an avatar image (data URL or base64) to Cloudinary.
 * Applies automatic face-detection centering, 200x200 resize, and WebP compression.
 */
export async function uploadAvatarToCloudinary(
  imageDataUrl: string
): Promise<{ url: string; publicId: string } | null> {
  if (!isCloudinaryConfigured) {
    console.warn("Cloudinary is not configured. Falling back to local data URL.");
    return null;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(imageDataUrl, {
      folder: "portfolio_guestbook",
      transformation: [
        { width: 200, height: 200, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
      resource_type: "image",
    });

    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
}
