import Image from "next/image";
import { useId } from "react";

interface CheckListDetailProps {
    name: string;
    isDone: boolean;
    onToggle: (checked: boolean) => void;
    onNameChange: (value: string) => void;
}

export default function CheckListDetail({
    name,
    isDone,
    onToggle,
    onNameChange,
}: CheckListDetailProps) {
    const checkboxId = useId();

    return (
        <div
            className={`flex h-16 w-full max-w-[996px] items-center gap-3 rounded-[24px] border-2 border-[var(--color-slate-900)] px-4 ${
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

            <input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full bg-transparent text-center [font-family:var(--font-family-base)] text-[20px] font-bold leading-[100%] tracking-[0] text-[var(--color-slate-800)] underline decoration-solid outline-none"
            />
        </div>
    );
}

