import { Item } from "@/types/item";
import Image from "next/image";
import Link from "next/link";

interface CheckListProps {
    item: Item;
    isDone: boolean;
    onToggle: (checked: boolean) => void;
}

export default function CheckList({ item, isDone, onToggle }: CheckListProps) {
    const checkboxId = `item-check-${item.id}`;

    return (
        <li className="list-none">
            <div
                className={`flex h-[50px] w-full max-w-[527px] items-center gap-2 rounded-[27px] border-2 border-[var(--color-slate-900)] px-2 ${
                    isDone ? "bg-[var(--color-violet-100)]" : "bg-white"
                }`}
            >
                <input
                    id={checkboxId}
                    type="checkbox"
                    checked={isDone}
                    onChange={(e) => onToggle(e.target.checked)}
                    className="sr-only"
                />
                <label
                    htmlFor={checkboxId}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center"
                >
                    <Image
                        src={
                            isDone
                                ? "/icons/checkbox-active/checkbox-active.svg"
                                : "/icons/checkbox-inactive/checkbox-inactive.svg"
                        }
                        alt=""
                        width={32}
                        height={32}
                    />
                </label>

                <Link
                    href={`/items/${item.id}`}
                    className={`[font-family:var(--font-family-base)] text-[16px] font-normal leading-[100%] tracking-[0] text-[var(--color-slate-800)] ${
                        isDone ? "line-through" : ""
                    }`}
                >
                    {item.name}
                </Link>
            </div>
        </li>
    );
}

