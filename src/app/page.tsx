import { getItems } from "@/lib/api/getItems";
import TodoListClient from "@/features/todo-list/TodoListClient";

export default async function Home() {
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
    const initialItems = await getItems({ tenantId });

    return (
        <main className="min-h-[calc(100vh-60px)] bg-slate-100">
            <TodoListClient initialItems={initialItems} />
        </main>
    );
}
