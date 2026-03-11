import Image from "next/image";
import Link from "next/link";

export default function Gnb() {
    return (
        <header className="h-[60px] w-full border-b border-[var(--color-slate-200)] bg-white">
            <div className="mx-auto flex h-full w-full max-w-[1200px] items-center px-4 min-[744px]:px-6 min-[1200px]:px-0">
                <Link
                    href="/"
                    className="inline-flex h-[40px] items-center"
                >
                    <Image
                        src="/assets/size-small/size-small.svg"
                        alt="do it 로고"
                        width={71}
                        height={40}
                        className="block min-[744px]:hidden"
                        priority
                    />
                    <Image
                        src="/assets/size-large/size-large.svg"
                        alt="do it 로고"
                        width={151}
                        height={40}
                        className="hidden min-[744px]:block"
                        priority
                    />
                </Link>
            </div>
        </header>
    );
}

