"use server";

import { put } from "@vercel/blob";

export async function uploadImage(formData: FormData): Promise<string> {
    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file provided");
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
        console.error("BLOB_READ_WRITE_TOKEN is not configured");
        throw new Error("Image upload is not configured. Please contact administrator.");
    }

    try {
        const blob = await put(file.name, file, {
            access: "public",
            token: token,
        });

        return blob.url;
    } catch (error) {
        console.error("Blob upload error:", error);
        throw new Error("Failed to upload image. Please try again.");
    }
}
