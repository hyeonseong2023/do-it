import TodoDetailClient from "@/features/todo-detail/TodoDetailClient";

interface ItemDetailPageProps {
    params: Promise<{
        itemId: number;
    }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
    const { itemId } = await params;

    return (
        <main>
            <section>
                {/* 상세 편집 기능은 클라이언트 컴포넌트에서 처리 */}
                <TodoDetailClient itemId={itemId} />
            </section>
        </main>
    );
}
