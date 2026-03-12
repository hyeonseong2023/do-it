import Gnb from "@/components/layout/Gnb";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "do it",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Gnb />
                {children}
            </body>
        </html>
    );
}
