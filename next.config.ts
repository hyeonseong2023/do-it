import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // 상세 페이지의 첨부한 원격 이미지를 next/image에서 허용
        remotePatterns: [
            {
                protocol: "https",
                hostname: "assignment-todolist-api.vercel.app",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
