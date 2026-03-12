import TodoDetailClient from "@/features/todo-detail/TodoDetailClient";

interface ItemDetailPageProps {
    params: Promise<{
        itemId: number;
    }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
    const { itemId } = await params;

    return (
        <main className="min-h-[calc(100vh-60px)] bg-slate-100">
            <section className="mx-auto max-w-[1200px]">
                <TodoDetailClient itemId={itemId} />
            </section>
        </main>
    );
}
