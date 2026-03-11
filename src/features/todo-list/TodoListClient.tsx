"use client";

import Button from "@/components/ui/Button";
import CheckList from "@/features/todo-list/CheckList";
import Search from "@/features/todo-list/Search";
import { createItem } from "@/lib/api/createItem";
import { getItems } from "@/lib/api/getItems";
import { updateItem } from "@/lib/api/updateItem";
import { Item } from "@/types/item";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

export default function TodoListClient() {
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;

    const [items, setItems] = useState<Item[]>([]);
    const [newItemName, setNewItemName] = useState("");

    // 첫 진입 시 목록 조회 후 화면 상태 초기화
    useEffect(() => {
        getItems({ tenantId })
            .then(setItems)
            .catch(() => {
                console.error("Failed to load items");
            });
    }, [tenantId]);

    // 입력값으로 새 할 일 생성 후 목록 상단 반영
    const handleCreateItem = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = newItemName.trim();
        if (!name) return;

        try {
            const createdItem = await createItem({ tenantId, name });
            setItems((prev) => [createdItem, ...prev]);
            setNewItemName("");
        } catch {
            console.error("Failed to create item");
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
        } catch {
            console.error("Failed to update item");
        }
    };

    // 완료 여부에 따라 TO DO / DONE 섹션 분리
    const incompleteItems = items.filter((item) => !item.isCompleted);
    const completedItems = items.filter((item) => item.isCompleted);

    return (
        <>
            <section>
                <form onSubmit={handleCreateItem} className="flex items-center gap-2">
                    <Search
                        placeholder="할 일을 입력해주세요"
                        value={newItemName}
                        onChange={(event) => setNewItemName(event.target.value)}
                    />
                    <Button
                        type="submit"
                        variant={
                            incompleteItems.length === 0 ? "add-empty" : "add-has-items"
                        }
                        iconOnlyOnMobile
                        className="shrink-0"
                    >
                        추가하기
                    </Button>
                </form>
            </section>

            <section>
                <h2>
                    <Image
                        src="/assets/todo/todo.svg"
                        alt="TO DO"
                        width={101}
                        height={36}
                    />
                </h2>
                <ul className="mt-3 space-y-2">
                    {incompleteItems.length === 0 && (
                        <li>할 일이 없어요. TODO를 새롭게 추가해주세요!</li>
                    )}
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
            </section>

            <section>
                <h2>
                    <Image
                        src="/assets/done/done.svg"
                        alt="DONE"
                        width={97}
                        height={36}
                    />
                </h2>
                <ul className="mt-3 space-y-2">
                    {completedItems.length === 0 && (
                        <li>
                            아직 다 한 일이 없어요. 해야 할 일을 체크해보세요!
                        </li>
                    )}
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
            </section>
        </>
    );
}