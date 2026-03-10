// 목록/상세에서 공통으로 사용하는 할 일 데이터 타입
export interface Item {
    id: number;
    tenantId: string;
    name: string;
    memo: string | null;
    imageUrl: string | null;
    isCompleted: boolean;
}
