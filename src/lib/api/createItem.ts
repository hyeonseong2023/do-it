import type { Item } from "@/types/item";

interface CreateItemParams {
    tenantId: string;
    name: string;
}

type ItemResponse = {
    id: number;
    tenantId: string;
    name: string;
    memo: string | null;
    imageUrl: string | null;
    isCompleted: boolean;
};

// 새 할 일을 생성하고 응답을 Item 형태로 정규화
export async function createItem({ tenantId, name }: CreateItemParams): Promise<Item> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("Missing API base URL");

    const response = await fetch(`${baseUrl}/${tenantId}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error("Failed to create item");

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
