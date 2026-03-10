import TodoDetailClient from "@/features/todo-detail/TodoDetailClient";
import Link from "next/link";

interface ItemDetailPageProps {
    params: Promise<{
        itemId: number;
    }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
    const { itemId } = await params;

    return (
        <main>
            <header>
                <h1>
                    {/* 로고 클릭 시 메인으로 이동 */}
                    <Link href="/">DO-IT</Link>
                </h1>
            </header>

            <section>
                {/* 상세 편집 기능은 클라이언트 컴포넌트에서 처리 */}
                <TodoDetailClient itemId={itemId} />
            </section>
        </main>
    );
}
