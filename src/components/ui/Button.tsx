import Image from "next/image";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant =
    | "add-empty" // 할 일이 비어 있을 때 추가 버튼
    | "add-has-items" // 할 일이 있을 때 추가 버튼
    | "delete" // 상세 페이지 삭제 버튼
    | "edit-unchanged" // 수정 내용이 없을 때 수정 완료 버튼
    | "edit-changed" // 수정 내용이 있을 때 수정 완료 버튼
    | "image-empty" // 이미지가 없을 때 업로드 버튼
    | "image-edit"; // 이미지가 있을 때 편집 버튼
type ButtonShape = "pill" | "icon";

interface ButtonStyle {
    buttonClass: string;
    iconSrc: string;
    iconClass?: string;
    iconSize?: number;
    iconButtonClass?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: ButtonVariant;
    shape?: ButtonShape;
    iconOnlyOnMobile?: boolean;
}

const BASE_CLASS =
    "inline-flex cursor-pointer items-center justify-center rounded-3xl border-2 border-slate-900 [font-family:var(--font-family-base)] font-bold text-base leading-none tracking-normal text-center shadow-[3px_6px_0_0_#0B1734] transition disabled:cursor-not-allowed disabled:opacity-50";

const PILL_CLASS = "h-[52px] gap-1 px-0";
const PILL_WIDTH_CLASS = "w-[164px] min-w-[164px]";
const ICON_CLASS = "h-[52px] w-[54px] p-0";
const IMAGE_ICON_CLASS = "h-16 w-16 p-0 rounded-full";
const MOBILE_ICON_ONLY_CLASS =
    "w-[54px] min-w-[54px] gap-0 px-0 sm:w-[164px] sm:min-w-[164px] sm:gap-1 sm:px-0";

const BUTTON_STYLES: Record<ButtonVariant, ButtonStyle> = {
    "add-empty": {
        buttonClass: "bg-violet-600 text-white",
        iconSrc: "/icons/plus/plus.svg",
    },
    "add-has-items": {
        buttonClass:
            "bg-slate-200 text-slate-900",
        iconSrc: "/icons/plus/plus.svg",
        iconClass: "brightness-0 saturate-100",
    },
    delete: {
        buttonClass: "bg-rose-500 text-white",
        iconSrc: "/icons/x/x.svg",
    },
    "edit-unchanged": {
        buttonClass:
            "bg-slate-200 text-slate-900",
        iconSrc: "/icons/check/check.svg",
        iconClass: "brightness-0 saturate-100",
    },
    "edit-changed": {
        buttonClass: "bg-lime-300 text-slate-900",
        iconSrc: "/icons/check/check.svg",
        iconClass: "brightness-0 saturate-100",
    },
    "image-empty": {
        buttonClass: "bg-slate-200 !border-0 shadow-none",
        iconSrc: "/icons/plus-image/plus-image.svg",
        iconSize: 24,
        iconButtonClass: IMAGE_ICON_CLASS,
    },
    "image-edit": {
        buttonClass:
            "bg-[var(--color-slate-900-50)] border-slate-900 shadow-none",
        iconSrc: "/icons/edit/edit.svg",
        iconSize: 24,
        iconButtonClass: IMAGE_ICON_CLASS,
    },
};

// 모바일에서 아이콘 전용 축소를 적용할 추가 버튼 variant 판별
function isAddButtonVariant(variant: ButtonVariant) {
    return variant === "add-empty" || variant === "add-has-items";
}

export default function Button({
    variant,
    shape = "pill",
    iconOnlyOnMobile = false,
    className,
    type = "button",
    children,
    ...props
}: ButtonProps) {
    const style = BUTTON_STYLES[variant];

    const shouldIconOnlyOnMobile =
        iconOnlyOnMobile && shape === "pill" && isAddButtonVariant(variant);

    const sizeClasses =
        shape === "icon"
            ? (style.iconButtonClass ?? ICON_CLASS)
            : shouldIconOnlyOnMobile
              ? `${PILL_CLASS} ${MOBILE_ICON_ONLY_CLASS}`
              : `${PILL_CLASS} ${PILL_WIDTH_CLASS}`;

    const buttonClasses = [
        BASE_CLASS,
        style.buttonClass,
        sizeClasses,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button type={type} className={buttonClasses} {...props}>
            <Image
                src={style.iconSrc}
                alt=""
                width={style.iconSize ?? 16}
                height={style.iconSize ?? 16}
                className={style.iconClass}
            />
            {shape === "pill" ? (
                <span
                    className={shouldIconOnlyOnMobile ? "hidden sm:inline" : ""}
                >
                    {children}
                </span>
            ) : null}
        </button>
    );
}
