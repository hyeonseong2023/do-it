"use client";

import { deleteItem } from "@/lib/api/deleteItem";
import { getItem } from "@/lib/api/getItem";
import { uploadImage } from "@/lib/api/uploadImage";
import { updateItem } from "@/lib/api/updateItem";
import { Item } from "@/types/item";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface TodoDetailClientProps {
    itemId: number;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function TodoDetailClient({ itemId }: TodoDetailClientProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [item, setItem] = useState<Item>({
        id: itemId,
        tenantId,
        name: "",
        memo: null,
        imageUrl: null,
        isCompleted: false,
    });

    // 상세 페이지 진입 시 항목 데이터 조회
    useEffect(() => {
        getItem({ tenantId, itemId })
            .then(setItem)
            .catch(() => {
                console.error("Failed to load item");
            });
    }, [tenantId, itemId]);

    // 새 이미지를 선택했다면 먼저 업로드한 뒤 수정 API에 반영
    const handleSave = async () => {
        let imageUrl = item.imageUrl ?? undefined;

        if (imageFile) {
            imageUrl = await uploadImage({ tenantId, image: imageFile });
        }

        const updatedItem = await updateItem({
            tenantId,
            itemId,
            name: item.name,
            memo: item.memo ?? "",
            imageUrl,
            isCompleted: item.isCompleted,
        });

        setItem(updatedItem);
        setImageFile(null);
        router.push("/");
    };

    // 삭제 후 목록 페이지로 이동
    const handleDelete = async () => {
        await deleteItem({ tenantId, itemId });
        router.push("/");
    };

    const handlePickImage = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 5MB 초과 파일은 업로드 불가
        if (file.size > MAX_IMAGE_SIZE) {
            alert("5MB 이하 파일만 업로드할 수 있어요.");
            e.target.value = "";
            return;
        }

        setImageFile(file);

        // 저장 전 사용자가 이미지를 확인할 수 있도록 미리보기
        const reader = new FileReader();
        reader.onload = () => {
            setItem((prev) => ({ ...prev, imageUrl: String(reader.result) }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <div>
                <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={(e) =>
                        setItem((prev) => ({
                            ...prev,
                            isCompleted: e.target.checked,
                        }))
                    }
                />
                <label>
                    name
                    <input
                        value={item.name}
                        onChange={(e) =>
                            setItem((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />
                </label>
            </div>

            <label>
                memo
                <textarea
                    value={item.memo ?? ""}
                    onChange={(e) =>
                        setItem((prev) => ({ ...prev, memo: e.target.value }))
                    }
                />
            </label>

            <div>
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                ) : (
                    <span>No image</span>
                )}
            </div>

            <button type="button" onClick={handlePickImage}>
                +
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
            />

            <button type="button" onClick={handleSave}>
                수정 완료
            </button>
            <button type="button" onClick={handleDelete}>
                삭제
            </button>
        </>
    );
}
