import Image from "next/image";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant =
    | "add-empty"
    | "add-has-items"
    | "delete"
    | "edit-unchanged"
    | "edit-changed"
    | "image-empty"
    | "image-edit";
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
    "inline-flex items-center justify-center rounded-[24px] border-2 border-[var(--color-slate-900)] [font-family:var(--font-family-base)] font-bold text-[16px] leading-[100%] tracking-[0] text-center shadow-[3px_6px_0_0_#0B1734] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_4px_0_0_#0B1734] disabled:cursor-not-allowed disabled:opacity-50";

const PILL_CLASS = "h-[52px] gap-1 px-0";
const PILL_WIDTH_CLASS = "w-[164.3478240966797px] min-w-[164.3478240966797px]";
const ICON_CLASS = "h-[52px] w-[54.78260803222656px] p-0";
const IMAGE_ICON_CLASS = "h-16 w-16 p-0 rounded-full";
const MOBILE_ICON_ONLY_CLASS =
    "w-[54.78260803222656px] min-w-[54.78260803222656px] gap-0 px-0 sm:w-[164.3478240966797px] sm:min-w-[164.3478240966797px] sm:gap-1 sm:px-0";

const BUTTON_STYLES: Record<ButtonVariant, ButtonStyle> = {
    "add-empty": {
        buttonClass: "bg-[var(--color-violet-600)] text-white",
        iconSrc: "/icons/plus/plus.svg",
    },
    "add-has-items": {
        buttonClass:
            "bg-[var(--color-slate-200)] text-[var(--color-slate-900)]",
        iconSrc: "/icons/plus/plus.svg",
        iconClass: "brightness-0 saturate-100",
    },
    delete: {
        buttonClass: "bg-[var(--color-rose-500)] text-white",
        iconSrc: "/icons/x/x.svg",
    },
    "edit-unchanged": {
        buttonClass:
            "bg-[var(--color-slate-200)] text-[var(--color-slate-900)]",
        iconSrc: "/icons/check/check.svg",
        iconClass: "brightness-0 saturate-100",
    },
    "edit-changed": {
        buttonClass: "bg-[var(--color-lime-300)] text-[var(--color-slate-900)]",
        iconSrc: "/icons/check/check.svg",
        iconClass: "brightness-0 saturate-100",
    },
    "image-empty": {
        buttonClass:
            "bg-[var(--color-slate-200)] border-[var(--color-slate-200)] shadow-none",
        iconSrc: "/icons/plus-image/plus-image.svg",
        iconSize: 24,
        iconButtonClass: IMAGE_ICON_CLASS,
    },
    "image-edit": {
        buttonClass:
            "bg-[var(--color-slate-900-50)] border-[var(--color-slate-900)] shadow-none",
        iconSrc: "/icons/edit/edit.svg",
        iconSize: 24,
        iconButtonClass: IMAGE_ICON_CLASS,
    },
};

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