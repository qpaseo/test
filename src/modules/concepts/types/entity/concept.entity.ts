//db 타입
export interface ConceptRow {
  concept_id: string;
  name: string;
  description: string | null;
  content: string;
  category: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Concept {
  conceptId: string;
  name: string;
  description: string | null;
  content: string;
  category: { [key: string]: string } | null;
  documentUrl: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
