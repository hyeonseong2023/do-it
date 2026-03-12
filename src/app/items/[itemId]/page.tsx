import TodoDetailClient from "@/features/todo-detail/TodoDetailClient";
import { getItem } from "@/lib/api/getItem";

interface ItemDetailPageProps {
    params: Promise<{
        itemId: number;
    }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
    const { itemId } = await params;
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
    const initialItem = await getItem({ tenantId, itemId });

    return (
        <main className="min-h-[calc(100vh-60px)] bg-slate-100">
            <section className="mx-auto max-w-[1200px]">
                <TodoDetailClient itemId={itemId} initialItem={initialItem} />
            </section>
        </main>
    );
}
