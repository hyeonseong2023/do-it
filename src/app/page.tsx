import TodoListClient from "@/features/todo-list/TodoListClient";
import Link from "next/link";

export default function Home() {
    return (
        <main>
            <header>
                <h1>
                    {/* 로고 클릭 시 메인으로 이동 */}
                    <Link href="/">DO IT</Link>
                </h1>
            </header>

            {/* 메인 페이지 핵심 기능은 목록 컴포넌트에서 처리 */}
            <TodoListClient />
        </main>
    );
}