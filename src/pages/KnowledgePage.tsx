import { useState, useRef, useCallback } from 'react';
import {
  BookOpen,
  Upload,
  Trash2,
  Send,
  FileText,
  Layers,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
  postCommand,
  type DocumentsResponse,
  type CommandResponse,
} from '@/lib/api';
import { CommandResponseView } from '@/components/CommandResponseView';
import { ErrorPanel, LoadingPanel } from '@/components/Panels';

const ACCEPTED_TYPES = '.pdf,.docx,.txt,.xlsx,.pptx';

export function KnowledgePage() {
  const [documents, setDocuments] = useState<DocumentsResponse | null>(null);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchInput, setSearchInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResponse, setSearchResponse] = useState<CommandResponse | null>(null);

  const loadDocuments = useCallback(async () => {
    setDocsLoading(true);
    setDocsError(null);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      setDocsError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setDocsLoading(false);
    }
  }, []);

  async function handleFileSelected(file: File) {
    setUploading(true);
    setUploadMsg(null);
    try {
      const res = await uploadDocument(file);
      setUploadMsg({ type: 'success', text: `${res.filename} — ${res.chunks} chunks indexed` });
      await loadDocuments();
    } catch (err) {
      setUploadMsg({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed' });
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelected(file);
  }

  async function handleDelete(filename: string) {
    try {
      await deleteDocument(filename);
      await loadDocuments();
    } catch (err) {
      setUploadMsg({ type: 'error', text: err instanceof Error ? err.message : `Failed to delete ${filename}` });
    }
  }

  async function handleSearch() {
    if (!searchInput.trim() || searchLoading) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearchResponse(null);
    try {
      const data = await postCommand(searchInput);
      setSearchResponse(data);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setSearchLoading(false);
    }
  }

  return (
    <div className="max-w-[760px] mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-light border border-accent/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="font-serif text-[22px] text-text-primary tracking-tight">Knowledge Base</h1>
          <p className="text-sm text-text-secondary">Upload, manage, and query your industrial document corpus.</p>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
          dragging ? 'border-accent bg-accent-light/50' : 'border-border hover:border-accent/40 hover:bg-surface'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelected(file); }}
        />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-accent-light border border-accent/20 flex items-center justify-center mb-3">
            {uploading ? (
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-accent" />
            )}
          </div>
          <p className="text-sm font-semibold text-text-primary mb-1">
            {uploading ? 'Uploading & indexing…' : 'Drop industrial documents here'}
          </p>
          <p className="text-xs text-text-tertiary">PDF, DOCX, TXT, XLSX, PPTX — click or drag to upload</p>
        </div>
      </div>

      {/* Upload message */}
      {uploadMsg && (
        <div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm animate-fade-in ${
            uploadMsg.type === 'success'
              ? 'bg-success-light text-success border border-success/20'
              : 'bg-danger-light text-danger border border-danger/20'
          }`}
        >
          {uploadMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {uploadMsg.text}
        </div>
      )}

      {/* Documents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">Documents</h2>
          {!documents && !docsLoading && (
            <button onClick={loadDocuments} className="text-sm text-accent hover:text-accent-hover transition-colors">
              Load
            </button>
          )}
        </div>
        {docsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          </div>
        ) : docsError ? (
          <ErrorPanel title="Documents Unavailable" message={docsError} onRetry={loadDocuments} />
        ) : documents ? (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs text-text-secondary">
              <Layers className="w-3.5 h-3.5" />
              <span>{documents.documents.length} documents</span>
              <span className="text-border">·</span>
              <span className="font-mono">{documents.total_chunks} total chunks</span>
            </div>
            {documents.documents.length === 0 ? (
              <p className="text-sm text-text-tertiary py-8 text-center">No documents uploaded yet.</p>
            ) : (
              <div className="space-y-1.5">
                {documents.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors">
                    <FileText className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                    <span className="font-mono text-sm text-text-primary flex-1 truncate">{doc}</span>
                    <button onClick={() => handleDelete(doc)} className="text-text-tertiary hover:text-danger transition-colors p-1" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Search */}
      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-3">Knowledge Search</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ask your industrial knowledge base…"
            className="input-field"
            disabled={searchLoading}
          />
          <button onClick={handleSearch} disabled={searchLoading || !searchInput.trim()} className="btn-primary flex-shrink-0">
            <Send className="w-4 h-4" />
            Search
          </button>
        </div>
        {searchLoading && <LoadingPanel message="Searching knowledge base…" />}
        {searchError && !searchLoading && <ErrorPanel title="Search Unavailable" message={searchError} onRetry={handleSearch} />}
        {searchResponse && !searchLoading && !searchError && <CommandResponseView data={searchResponse} />}
      </div>
    </div>
  );
}
