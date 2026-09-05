import { useState, useRef } from 'react';
import {
  ScanLine,
  Upload,
  Play,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Wrench,
  Eye,
  Droplet,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { postInspection, type InspectionResponse, type Observation } from '@/lib/api';
import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import { ErrorPanel, LoadingPanel, SectionCard } from '@/components/Panels';

const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.webp';

function severityConfig(severity: string) {
  const s = severity.toLowerCase();
  if (s.includes('critical') || s.includes('high'))
    return { color: 'text-danger', bg: 'bg-danger-light', border: 'border-danger/20', icon: XCircle };
  if (s.includes('medium') || s.includes('warning') || s.includes('moderate'))
    return { color: 'text-warning', bg: 'bg-warning-light', border: 'border-warning/20', icon: AlertTriangle };
  if (s.includes('low') || s.includes('info') || s.includes('minor'))
    return { color: 'text-info', bg: 'bg-info-light', border: 'border-info/20', icon: Info };
  return { color: 'text-success', bg: 'bg-success-light', border: 'border-success/20', icon: CheckCircle2 };
}

function conditionBadge(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes('critical') || c.includes('poor') || c.includes('severe'))
    return { color: 'text-danger', bg: 'bg-danger-light', border: 'border-danger/30' };
  if (c.includes('fair') || c.includes('moderate') || c.includes('attention'))
    return { color: 'text-warning', bg: 'bg-warning-light', border: 'border-warning/30' };
  if (c.includes('good') || c.includes('excellent'))
    return { color: 'text-success', bg: 'bg-success-light', border: 'border-success/30' };
  return { color: 'text-text-secondary', bg: 'bg-surface-hover', border: 'border-border' };
}

function ObservationCard({ obs }: { obs: Observation }) {
  const cfg = severityConfig(obs.severity);
  const Icon = cfg.icon;
  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3.5`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 ${cfg.color} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}>{obs.severity}</span>
            <span className="text-xs text-text-tertiary">·</span>
            <span className="text-xs text-text-secondary font-mono">{obs.type}</span>
          </div>
          <p className="text-sm text-text-primary mb-1">{obs.description}</p>
          {obs.location && <p className="text-xs text-text-tertiary font-mono">Location: {obs.location}</p>}
        </div>
      </div>
    </div>
  );
}

function BooleanChip({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const active = value;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider border ${
        active
          ? 'bg-danger-light text-danger border-danger/20'
          : 'bg-surface text-text-tertiary border-border'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}: {active ? 'Detected' : 'None'}
    </span>
  );
}

export function InspectionPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InspectionResponse | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelected(file: File) {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelected(file);
  }

  async function handleAnalyze() {
    if (!selectedFile || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await postInspection(selectedFile);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inspection failed');
    } finally {
      setLoading(false);
    }
  }

  const lowConfidence = result && result.confidence < 0.5;
  const showInsufficientWarning = lowConfidence && !result.fallback_used;

  return (
    <div className="max-w-[760px] mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-light border border-accent/20 flex items-center justify-center">
          <ScanLine className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="font-serif text-[22px] text-text-primary tracking-tight">Visual Inspection</h1>
          <p className="text-sm text-text-secondary">Upload equipment imagery for AI-powered visual analysis and condition assessment.</p>
        </div>
      </div>

      {/* Upload zone + preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !imagePreview && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 transition-all min-h-[220px] flex items-center justify-center ${
            imagePreview ? 'border-border bg-surface cursor-default' : 'cursor-pointer hover:border-accent/40 hover:bg-surface'
          } ${dragging ? 'border-accent bg-accent-light/50' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelected(file); }}
          />
          {imagePreview ? (
            <div className="w-full">
              <img src={imagePreview} alt="Equipment preview" className="w-full h-48 object-contain rounded-xl" />
              <button
                onClick={(e) => { e.stopPropagation(); setImagePreview(null); setSelectedFile(null); setResult(null); }}
                className="btn-ghost mt-3 text-xs w-full border border-border"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-accent-light border border-accent/20 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-semibold text-text-primary">Drop image here</p>
              <p className="text-xs text-text-tertiary mt-1">JPG, JPEG, PNG, WEBP</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <button onClick={handleAnalyze} disabled={!selectedFile || loading} className="btn-primary w-full mb-3">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
          {selectedFile && !loading && (
            <p className="text-xs text-text-tertiary text-center">
              Ready: <span className="font-mono">{selectedFile.name}</span>
            </p>
          )}
          {loading && (
            <p className="text-xs text-text-secondary text-center mt-2">
              VisionCore agent is inspecting the image…
            </p>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && <LoadingPanel message="Running visual inspection…" />}

      {/* Error */}
      {error && !loading && <ErrorPanel title="Inspection Unavailable" message={error} onRetry={handleAnalyze} />}

      {/* Results */}
      {result && !loading && !error && (
        <div className="space-y-4 animate-fade-in">
          {result.fallback_used && (
            <div className="flex items-center gap-2 p-3 rounded-xl border-l-[3px] border-l-warning bg-warning-light">
              <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
              <p className="text-sm text-warning">
                Fallback analysis used — the vision model was unavailable. Results are heuristic and should be verified manually.
              </p>
            </div>
          )}

          {showInsufficientWarning && (
            <div className="flex items-start gap-3 p-4 rounded-xl border-l-[3px] border-l-danger bg-danger-light">
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-danger uppercase tracking-wider">Insufficient Visual Evidence</p>
                <p className="text-xs text-text-secondary mt-1">
                  Confidence is below threshold. No reliable verdict can be issued — collect additional imagery from alternate angles.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.equipment_guess && (
              <SectionCard title="Equipment Identification" icon={Wrench}>
                <p className="text-sm text-text-primary font-medium">{result.equipment_guess}</p>
              </SectionCard>
            )}
            {result.overall_visual_condition && !showInsufficientWarning && (
              <SectionCard title="Overall Condition" icon={Eye}>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold uppercase tracking-wider border ${
                    conditionBadge(result.overall_visual_condition).color
                  } ${conditionBadge(result.overall_visual_condition).bg}
                  ${conditionBadge(result.overall_visual_condition).border}`}
                >
                  {result.overall_visual_condition}
                </span>
              </SectionCard>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <BooleanChip label="Leak" value={result.visible_leak} icon={Droplet} />
            <BooleanChip label="Damage" value={result.visible_damage} icon={AlertCircle} />
            <BooleanChip label="Corrosion" value={result.visible_corrosion} icon={ShieldAlert} />
          </div>

          {result.observations && result.observations.length > 0 && (
            <SectionCard title="Observations" icon={ScanLine}>
              <div className="space-y-2">
                {result.observations.map((obs, i) => (
                  <ObservationCard key={i} obs={obs} />
                ))}
              </div>
            </SectionCard>
          )}

          {typeof result.confidence === 'number' && (
            <SectionCard title="Inspection Confidence" icon={ScanLine}>
              <ConfidenceMeter value={result.confidence} />
              {result.raw_description && (
                <p className="text-xs text-text-tertiary mt-3 italic leading-relaxed">{result.raw_description}</p>
              )}
            </SectionCard>
          )}
        </div>
      )}
    </div>
  );
}
