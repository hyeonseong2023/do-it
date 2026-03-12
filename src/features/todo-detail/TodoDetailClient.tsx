"use client";

import Button from "@/components/ui/Button";
import CheckListDetail from "@/features/todo-detail/CheckListDetail";
import { deleteItem } from "@/lib/api/deleteItem";
import { getItem } from "@/lib/api/getItem";
import { uploadImage } from "@/lib/api/uploadImage";
import { updateItem } from "@/lib/api/updateItem";
import { Item } from "@/types/item";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface TodoDetailClientProps {
    itemId: number;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ENGLISH_FILE_NAME_PATTERN = /^[A-Za-z0-9._-]+$/;

export default function TodoDetailClient({ itemId }: TodoDetailClientProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const memoTextareaRef = useRef<HTMLTextAreaElement>(null);
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [savedItem, setSavedItem] = useState<Item | null>(null);
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
            .then((loadedItem) => {
                setItem(loadedItem);
                setSavedItem(loadedItem);
            })
            .catch(() => {
                console.error("Failed to load item");
            });
    }, [tenantId, itemId]);

    // 메모 내용이 짧을 때는 입력 영역 안에서 세로 중앙 정렬
    useEffect(() => {
        const adjustMemoPadding = () => {
            const textarea = memoTextareaRef.current;
            if (!textarea) return;

            const previousHeight = textarea.style.height;
            const previousPaddingTop = textarea.style.paddingTop;

            textarea.style.paddingTop = "0px";
            textarea.style.height = "0px";
            const contentHeight = textarea.scrollHeight;
            textarea.style.height = previousHeight;
            textarea.style.paddingTop = previousPaddingTop;

            const nextPaddingTop = Math.max(
                Math.floor((textarea.clientHeight - contentHeight) / 2),
                0,
            );

            textarea.style.paddingTop = `${nextPaddingTop}px`;
        };

        adjustMemoPadding();
        window.addEventListener("resize", adjustMemoPadding);

        return () => {
            window.removeEventListener("resize", adjustMemoPadding);
        };
    }, [item.memo]);

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
        setSavedItem(updatedItem);
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

    // 이미지 파일 검증 후 미리보기 상태에 반영
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 영문 파일명만 허용
        if (!ENGLISH_FILE_NAME_PATTERN.test(file.name)) {
            alert("이미지 파일 이름엔 영어만 들어갈 수 있어요.");
            e.target.value = "";
            return;
        }

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

    // 저장된 원본과 비교해 수정 완료 버튼 상태 결정
    const hasChanges =
        savedItem !== null &&
        (item.name !== savedItem.name ||
            (item.memo ?? "") !== (savedItem.memo ?? "") ||
            item.imageUrl !== savedItem.imageUrl ||
            item.isCompleted !== savedItem.isCompleted ||
            imageFile !== null);

    return (
        <div className="mx-auto flex min-h-[calc(100vh-60px)] w-full max-w-[1200px] flex-col gap-4 bg-white px-4 py-4 min-[744px]:gap-6 min-[744px]:px-6 min-[744px]:py-6 min-[1200px]:px-[102px]">
            <CheckListDetail
                name={item.name}
                isDone={item.isCompleted}
                onToggle={(checked) =>
                    setItem((prev) => ({ ...prev, isCompleted: checked }))
                }
                onNameChange={(value) =>
                    setItem((prev) => ({ ...prev, name: value }))
                }
            />

            <div className="grid grid-cols-1 gap-4 min-[744px]:gap-6 min-[1200px]:grid-cols-[384px_589px] min-[1200px]:gap-6">
                <section>
                    <div
                        className={`relative h-[311px] w-full overflow-hidden rounded-3xl min-[1200px]:w-[384px] ${
                            item.imageUrl
                                ? "bg-slate-100"
                                : "border-2 border-dashed border-slate-300 bg-slate-100"
                        }`}
                    >
                        {item.imageUrl ? (
                            <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Image
                                    src="/assets/img/img.svg"
                                    alt="이미지 없음"
                                    width={64}
                                    height={64}
                                />
                            </div>
                        )}

                        <div className="absolute bottom-4 right-4">
                            <Button
                                type="button"
                                onClick={handlePickImage}
                                variant={item.imageUrl ? "image-edit" : "image-empty"}
                                shape="icon"
                            >
                                이미지 편집
                            </Button>
                        </div>
                    </div>
                </section>

                <section>
                    <div
                        className="relative h-[311px] w-full overflow-hidden rounded-3xl bg-cover bg-center min-[1200px]:w-[589px]"
                        style={{ backgroundImage: "url('/assets/memo/memo.svg')" }}
                    >
                        <p className="absolute left-1/2 top-[18px] -translate-x-1/2 [font-family:var(--font-family-base)] text-base font-extrabold leading-none tracking-normal text-amber-800">
                            Memo
                        </p>
                        <textarea
                            ref={memoTextareaRef}
                            value={item.memo ?? ""}
                            onChange={(e) =>
                                setItem((prev) => ({ ...prev, memo: e.target.value }))
                            }
                            className="absolute left-4 top-14 h-[229px] w-[calc(100%-32px)] resize-none overflow-y-auto bg-transparent [font-family:var(--font-family-base)] text-center text-base font-normal leading-none tracking-normal text-slate-800 outline-none [scrollbar-width:thin] [scrollbar-color:var(--color-amber-200)_transparent] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-amber-200 [&::-webkit-scrollbar-button]:hidden"
                        />
                    </div>
                </section>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
            />

            <div className="flex flex-wrap items-center justify-center gap-2 min-[744px]:gap-3 min-[1200px]:justify-end">
                <Button
                    type="button"
                    onClick={handleSave}
                    variant={hasChanges ? "edit-changed" : "edit-unchanged"}
                >
                    수정 완료
                </Button>
                <Button type="button" onClick={handleDelete} variant="delete">
                    삭제하기
                </Button>
            </div>
        </div>
    );
}
