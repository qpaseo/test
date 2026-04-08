export interface Concept {
  concept_id: string;
  name: string;
  description: string | null;
  content: string;
  category: any | null; // JSON
  document_url: string | null;
  created_at: Date;
  updated_at: Date;
}
