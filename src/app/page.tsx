import TodoListClient from "@/features/todo-list/TodoListClient";

export default function Home() {
    return (
        <main className="min-h-[calc(100vh-60px)] bg-slate-100">
            <TodoListClient />
        </main>
    );
}