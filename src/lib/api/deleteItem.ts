interface DeleteItemParams {
    tenantId: string;
    itemId: number;
}

type ItemResponse = {
    message: string;
};

// 항목 삭제 후 서버 응답 메시지 반환
export async function deleteItem({
    tenantId,
    itemId,
}: DeleteItemParams): Promise<ItemResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("Missing API base URL");

    const response = await fetch(`${baseUrl}/${tenantId}/items/${itemId}`, {
        method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete item");

    const responseJson = await response.json();

    return {
        message: responseJson.message,
    };
}
