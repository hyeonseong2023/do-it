import type { Item } from "@/types/item";

interface GetItemsParams {
    tenantId: string;
    page?: number;
    pageSize?: number;
}

type ItemListRow = {
    id: number;
    name: string;
    isCompleted: boolean;
};

// 목록 API 응답을 공통 Item 타입으로 맞춰 반환
export async function getItems({
    tenantId,
    page = 1,
    pageSize = 10,
}: GetItemsParams): Promise<Item[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("Missing API base URL");

    const query = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });

    const response = await fetch(`${baseUrl}/${tenantId}/items?${query.toString()}`, {
        cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to load items");

    const rows = (await response.json()) as ItemListRow[];

    return rows.map((row) => ({
        id: row.id,
        tenantId,
        name: row.name,
        memo: null,
        imageUrl: null,
        isCompleted: row.isCompleted,
    }));
}
