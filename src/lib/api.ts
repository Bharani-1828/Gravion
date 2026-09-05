export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '/api';

export interface EvidenceItem {
  document: string;
  page: number;
  score: number;
  excerpt: string;
  section?: string;
  vector_score?: number;
  section_boost?: number;
}

export interface Finding {
  finding: string;
  value?: string;
  reference?: string;
}

export type ChecklistStatus = 'Pass' | 'Attention' | 'Fail' | 'N/A';

export interface ChecklistItem {
  point: string;
  status: ChecklistStatus;
  remark?: string;
}

export interface ConfidenceBreakdown {
  retrieval_relevance: number;
  source_coverage: number;
  consistency: number;
  answer_grounding: number;
  overall: number;
}

export interface CommandResponse {
  status: string;
  command: string;
  task_type: string;
  agents: string[];
  message: string;
  assessment?: string;
  evidence?: EvidenceItem[];
  findings?: Finding[];
  confidence?: number;
  confidence_breakdown?: ConfidenceBreakdown;
  contradiction?: string;
  retries?: number;
  checklist_items?: ChecklistItem[];
}

export interface UploadResponse {
  status: string;
  filename: string;
  chunks: number;
  message: string;
}

export interface DocumentsResponse {
  documents: string[];
  total_chunks: number;
}

export interface Observation {
  type: string;
  severity: string;
  location: string;
  description: string;
}

export interface InspectionResponse {
  status: string;
  agent: string;
  equipment_guess?: string;
  observations: Observation[];
  visible_leak: boolean;
  visible_damage: boolean;
  visible_corrosion: boolean;
  overall_visual_condition: string;
  confidence: number;
  raw_description: string;
  fallback_used: boolean;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.message || body?.detail || '';
    } catch {
      // ignore parse failure
    }
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function postCommand(message: string): Promise<CommandResponse> {
  const res = await fetch(`${API_BASE_URL}/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return handleResponse<CommandResponse>(res);
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: form,
  });
  return handleResponse<UploadResponse>(res);
}

export async function getDocuments(): Promise<DocumentsResponse> {
  const res = await fetch(`${API_BASE_URL}/documents`);
  return handleResponse<DocumentsResponse>(res);
}

export async function deleteDocument(filename: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/documents/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete ${filename}`);
  }
}

export async function postInspection(file: File): Promise<InspectionResponse> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE_URL}/inspect`, {
    method: 'POST',
    body: form,
  });
  return handleResponse<InspectionResponse>(res);
}
