import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";

export type UploadResult = {
  assetId: string;
  publicId: string;
  uri?: string;
  url?: string;
  secureUri?: string;
  secureUrl?: string;
  length: number;
  bytes: number;
  format: string;
};

class UploadService {
  async uploadImage(file: File, signal?: AbortSignal) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await httpClient.post<ApiResponse<UploadResult>>(
      "/upload",
      formData,
      {
        signal,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return response.data;
  }
}

export const uploadService = new UploadService();
