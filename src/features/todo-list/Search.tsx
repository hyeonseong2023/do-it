import { InputHTMLAttributes } from "react";

type SearchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function Search({ className, ...props }: SearchProps) {
    // 메인 페이지 검색/입력 컴포넌트
    const classes = [
        "h-[52.5px] w-full max-w-[996px] rounded-[24px] border-2 border-[var(--color-slate-900)] bg-[var(--color-slate-100)] px-4 align-middle [font-family:var(--font-family-base)] text-[16px] font-normal leading-[100%] tracking-[0] text-[var(--color-slate-900)] placeholder:text-[var(--color-slate-500)] outline-none",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return <input type="text" className={classes} {...props} />;
}
