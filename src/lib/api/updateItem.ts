import type { Item } from "@/types/item";

interface UpdateItemParams {
    tenantId: string;
    itemId: number;
    name?: string;
    memo?: string;
    imageUrl?: string;
    isCompleted?: boolean;
}

type ItemResponse = {
    id: number;
    tenantId: string;
    name: string;
    memo: string | null;
    imageUrl: string | null;
    isCompleted: boolean;
};

// 수정할 필드를 PATCH로 전송하고 최신 항목 데이터 반환
export async function updateItem({
    tenantId,
    itemId,
    name,
    memo,
    imageUrl,
    isCompleted,
}: UpdateItemParams): Promise<Item> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("Missing API base URL");

    const response = await fetch(`${baseUrl}/${tenantId}/items/${itemId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, memo, imageUrl, isCompleted }),
    });

    if (!response.ok) throw new Error("Failed to update item");

    const item = (await response.json()) as ItemResponse;

    return {
        id: item.id,
        tenantId: item.tenantId,
        name: item.name,
        memo: item.memo,
        imageUrl: item.imageUrl,
        isCompleted: item.isCompleted,
    };
}
