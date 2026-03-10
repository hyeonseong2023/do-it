interface UploadImageParams {
    tenantId: string;
    image: File;
}

type UploadImageResponse = {
    url: string;
};

// 이미지 업로드 후 항목 수정에 사용할 URL 반환
export async function uploadImage({
    tenantId,
    image,
}: UploadImageParams): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("Missing API base URL");

    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${baseUrl}/${tenantId}/images/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload image");

    const result = (await response.json()) as UploadImageResponse;
    return result.url;
}
