import {
  MAX_FILE_SIZE_ALLOWED_MB,
  MAX_FILE_SIZE_FOR_UPLOAD_MB,
} from "@/lib/definitions";
import imageCompression from "browser-image-compression";

export async function resizeImageFile(file: File): Promise<string | null> {
  if (file.size > MAX_FILE_SIZE_ALLOWED_MB * 1024 * 1024) {
    throw new Error(`Choose image smaller than ${MAX_FILE_SIZE_ALLOWED_MB}MB`);
  }
  console.log(
    "Original file size:",
    (file.size / 1024 / 1024).toFixed(2),
    "MB",
  );

  try {
    const compressedFile = await imageCompression(file, {
      useWebWorker: true,
      maxWidthOrHeight: 750,
      maxSizeMB: MAX_FILE_SIZE_FOR_UPLOAD_MB,
    });
    console.log(
      "Compressed file size:",
      (compressedFile.size / 1024 / 1024).toFixed(2),
      "MB",
    );
    return await imageCompression.getDataUrlFromFile(compressedFile);
  } catch (error) {
    console.error("Error compressing image:", error);
    return null;
  }
}
