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
            className={`flex h-16 w-full max-w-[996px] items-center justify-center rounded-3xl border-2 border-slate-900 px-4 ${
                isDone ? "bg-violet-100" : "bg-white"
            }`}
        >
            <div className="flex max-w-[calc(100%-24px)] items-center justify-center gap-4 overflow-hidden">
                <input
                    id={checkboxId}
                    type="checkbox"
                    checked={isDone}
                    onChange={(e) => onToggle(e.target.checked)}
                    className="sr-only"
                />
                <label
                    htmlFor={checkboxId}
                    className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center"
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
                    className="min-w-6 max-w-[calc(100vw-128px)] bg-transparent text-left field-sizing-content [font-family:var(--font-family-base)] text-xl font-bold leading-none tracking-normal align-middle text-slate-800 underline decoration-solid underline-offset-[3px] decoration-1 outline-none min-[744px]:max-w-[calc(100vw-176px)] min-[1200px]:max-w-[900px]"
                />
            </div>
        </div>
    );
}
