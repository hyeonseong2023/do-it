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
                className={`flex h-[50px] w-full items-center gap-4 rounded-[27px] border-2 border-slate-900 px-2 min-[1200px]:max-w-[527px] ${
                    isDone ? "bg-violet-100" : "bg-white"
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
                    className={`truncate [font-family:var(--font-family-base)] text-base font-normal leading-none tracking-normal text-slate-800 ${
                        isDone ? "line-through" : ""
                    }`}
                >
                    {item.name}
                </Link>
            </div>
        </li>
    );
}