// 상세 조회: concept_id · updated_at 제외, 나머지 전부
export interface ConceptDetailResponse {
  id: string;
  name: string;
  description: string | null;
  content: string;
  category: string[] | null;
  documentUrl: string | null;
  createdAt: string;
}

// 리스트 조회: concept_id, name, description, category, created_at
export interface ConceptListItemResponse {
  conceptId: string;
  name: string;
  description: string | null;
  category: string[] | null;
  createdAt: string;
}

export interface ConceptListResponse {
  items: ConceptListItemResponse[];
  total: number;
  page: number;
  totalPages: number;
}
