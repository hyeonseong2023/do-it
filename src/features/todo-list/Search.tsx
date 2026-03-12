import { ChangeEvent } from "react";

interface SearchProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export default function Search({ value, onChange, disabled = false }: SearchProps) {
    // 메인 페이지 입력 전용 컴포넌트
    return (
        <input
            type="text"
            placeholder="할 일을 입력해주세요"
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="h-[52px] w-full max-w-[996px] flex-1 rounded-3xl border-2 border-slate-900 bg-slate-100 px-4 align-middle [font-family:var(--font-family-base)] text-base font-normal leading-none tracking-normal text-slate-900 placeholder:text-slate-500 outline-none disabled:cursor-not-allowed disabled:opacity-70"
        />
    );
}
