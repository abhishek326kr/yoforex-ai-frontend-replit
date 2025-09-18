// Simple Cloudinary upload helper
// Requires env variables:
// - VITE_CLOUDINARY_CLOUD_NAME
// - VITE_CLOUDINARY_UPLOAD_PRESET (unsigned preset is recommended for client-side uploads)
// Optional:
// - VITE_CLOUDINARY_FOLDER
import axios from "axios";

export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  secure_url: string;
  url: string;
  [key: string]: any;
}

export async function uploadImageToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
  const folder = (import.meta.env.VITE_CLOUDINARY_FOLDER as string) || "yoforex/avatars";

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary config. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  try {
    const res = await axios.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as CloudinaryUploadResult;
  } catch (err: any) {
    const status = err?.response?.status;
    const text = err?.response?.data ? JSON.stringify(err.response.data) : err?.message;
    throw new Error(`Cloudinary upload failed: ${status ?? ''} ${text ?? ''}`.trim());
  }
}
