import type { Item } from "@/types/item";

interface GetItemParams {
    tenantId: string;
    itemId: number;
}

// 상세 API 응답을 화면에서 쓰는 Item 형태로 반환
export async function getItem({
    tenantId,
    itemId,
}: GetItemParams): Promise<Item> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("Missing API base URL");

    const response = await fetch(`${baseUrl}/${tenantId}/items/${itemId}`);
    if (!response.ok) throw new Error("Failed to load item");

    const row = await response.json();

    return {
        id: row.id,
        tenantId: row.tenantId,
        name: row.name,
        memo: row.memo,
        imageUrl: row.imageUrl,
        isCompleted: row.isCompleted,
    };
}
