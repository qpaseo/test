// db 타입
export interface ConceptRow {
  concept_id: string;
  name: string;
  description: string | null;
  content: string;
  category: string[] | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

// 목록 조회용 (updated_at 제외)
export interface ConceptSummaryRow {
  concept_id: string;
  name: string;
  description: string | null;
  category: string[] | null;
  created_at: string;
}

export interface Concept {
  conceptId: string;
  name: string;
  description: string | null;
  content: string;
  category: string[] | null;
  documentUrl: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
