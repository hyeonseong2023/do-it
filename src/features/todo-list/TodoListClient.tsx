"use client";

import Button from "@/components/ui/Button";
import CheckList from "@/features/todo-list/CheckList";
import Search from "@/features/todo-list/Search";
import { createItem } from "@/lib/api/createItem";
import { updateItem } from "@/lib/api/updateItem";
import { Item } from "@/types/item";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";

interface EmptyStateProps {
    type: "todo" | "done";
}

interface TodoListClientProps {
    initialItems: Item[];
}

// 항목이 비어 있을 때 TO DO / DONE 안내 일러스트와 문구 표시
function EmptyState({ type }: EmptyStateProps) {
    const isTodo = type === "todo";
    const title = isTodo ? "할 일이 없어요." : "아직 다 한 일이 없어요.";
    const description = isTodo
        ? "TODO를 새롭게 추가해주세요!"
        : "해야 할 일을 체크해보세요!";

    return (
        <div className="mt-4 flex min-h-[180px] flex-col items-center justify-center gap-3 py-2 text-center min-[744px]:mt-6 min-[744px]:min-h-[260px] min-[744px]:gap-4 min-[1200px]:mt-8 min-[1200px]:min-h-80">
            <Image
                src={
                    isTodo
                        ? "/assets/type-todo-size-small/type-todo-size-small.svg"
                        : "/assets/type-done-size-small/type-done-size-small.svg"
                }
                alt={isTodo ? "TO DO 빈 상태" : "DONE 빈 상태"}
                width={120}
                height={120}
                className="block min-[744px]:hidden"
            />
            <Image
                src={
                    isTodo
                        ? "/assets/type-todo-size-large/type-todo-size-large.svg"
                        : "/assets/type-done-size-large/type-done-size-large.svg"
                }
                alt={isTodo ? "TO DO 빈 상태" : "DONE 빈 상태"}
                width={240}
                height={isTodo ? 240 : 220}
                className="hidden min-[744px]:block"
            />
            <div className="[font-family:var(--font-family-base)] text-base font-bold leading-none tracking-normal text-slate-400">
                <p>{title}</p>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function TodoListClient({ initialItems }: TodoListClientProps) {
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
    const createLockRef = useRef(false);

    const [items, setItems] = useState(initialItems);
    const [newItemName, setNewItemName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    // 입력값으로 새 할 일 생성 후 목록 상단 반영
    const handleCreateItem = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (createLockRef.current) return;

        const name = newItemName.trim();
        if (!name) return;

        createLockRef.current = true;
        setIsCreating(true);

        try {
            const createdItem = await createItem({ tenantId, name });
            setItems((prev) => [createdItem, ...prev]);
            setNewItemName("");
        } catch (error) {
            console.error("Failed to create item", error);
            alert("할 일 추가에 실패했어요. 잠시 후 다시 시도해주세요.");
        } finally {
            createLockRef.current = false;
            setIsCreating(false);
        }
    };

    // 체크 상태를 서버에 저장하고 변경된 항목만 교체
    const handleToggleItem = async (itemId: number, isCompleted: boolean) => {
        try {
            const updatedItem = await updateItem({
                tenantId,
                itemId,
                isCompleted,
            });
            setItems((prev) =>
                prev.map((item) => (item.id === itemId ? updatedItem : item)),
            );
        } catch (error) {
            console.error("Failed to update item", error);
            alert("할 일 상태 변경에 실패했어요. 잠시 후 다시 시도해주세요.");
        }
    };

    // 완료 여부에 따라 TO DO / DONE 섹션 분리
    const incompleteItems = items.filter((item) => !item.isCompleted);
    const completedItems = items.filter((item) => item.isCompleted);

    return (
        <div className="mx-auto flex w-full max-w-[1200px] flex-col px-4 py-4 min-[744px]:px-6 min-[744px]:py-6 min-[1200px]:px-0">
            <section className="w-full">
                <form
                    onSubmit={handleCreateItem}
                    className="flex w-full items-center gap-2 min-[744px]:gap-3"
                >
                    <Search
                        value={newItemName}
                        onChange={(event) => setNewItemName(event.target.value)}
                        disabled={isCreating}
                    />
                    <Button
                        type="submit"
                        variant={
                            incompleteItems.length === 0
                                ? "add-empty"
                                : "add-has-items"
                        }
                        iconOnlyOnMobile
                        className="shrink-0"
                        disabled={isCreating}
                    >
                        추가하기
                    </Button>
                </form>
            </section>

            <div className="mt-6 grid grid-cols-1 gap-8 min-[744px]:mt-8 min-[744px]:gap-10 min-[1200px]:grid-cols-[527px_527px] min-[1200px]:justify-between min-[1200px]:gap-8">
                <section className="w-full">
                    <h2>
                        <Image
                            src="/assets/todo/todo.svg"
                            alt="TO DO"
                            width={101}
                            height={36}
                        />
                    </h2>
                    {incompleteItems.length === 0 ? (
                        <EmptyState type="todo" />
                    ) : (
                        <ul className="mt-4 space-y-2 min-[744px]:mt-5">
                            {incompleteItems.map((item) => (
                                <CheckList
                                    key={item.id}
                                    item={item}
                                    isDone={false}
                                    onToggle={(checked) =>
                                        handleToggleItem(item.id, checked)
                                    }
                                />
                            ))}
                        </ul>
                    )}
                </section>

                <section className="w-full">
                    <h2>
                        <Image
                            src="/assets/done/done.svg"
                            alt="DONE"
                            width={97}
                            height={36}
                        />
                    </h2>
                    {completedItems.length === 0 ? (
                        <EmptyState type="done" />
                    ) : (
                        <ul className="mt-4 space-y-2 min-[744px]:mt-5">
                            {completedItems.map((item) => (
                                <CheckList
                                    key={item.id}
                                    item={item}
                                    isDone
                                    onToggle={(checked) =>
                                        handleToggleItem(item.id, checked)
                                    }
                                />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}

