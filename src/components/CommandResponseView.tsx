import type { CommandResponse } from '@/lib/api';
import { SectionCard } from '@/components/Panels';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfidenceMeter, ConfidenceBreakdownBar } from '@/components/ConfidenceMeter';
import {
  FileText,
  Search,
  ListChecks,
  Gauge,
  AlertTriangle,
  Bot,
  ClipboardList,
  Quote,
} from 'lucide-react';

export function CommandResponseView({ data }: { data: CommandResponse }) {
  return (
    <div className="space-y-4">
      {/* Message */}
      <div className="panel p-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-light border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Response
              </span>
              {data.task_type && (
                <span className="chip bg-accent-light text-accent border border-accent/20">
                  {data.task_type}
                </span>
              )}
            </div>
            <p className="text-sm text-text-primary leading-relaxed">{data.message}</p>
          </div>
        </div>
      </div>

      {/* Agents */}
      {data.agents && data.agents.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-tertiary uppercase tracking-wider font-medium">
            Agents:
          </span>
          {data.agents.map((agent, i) => (
            <span key={i} className="chip bg-surface-hover text-text-secondary border border-border">
              <Bot className="w-3 h-3" />
              {agent}
            </span>
          ))}
        </div>
      )}

      {/* Assessment */}
      {data.assessment && (
        <div className="panel-elevated p-4 border-l-[3px] border-l-accent animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-semibold text-accent uppercase tracking-wider">
              Assessment
            </h3>
          </div>
          <p className="text-sm text-text-primary leading-relaxed font-medium">
            {data.assessment}
          </p>
        </div>
      )}

      {/* Contradiction warning */}
      {data.contradiction && (
        <div className="panel p-4 border-l-[3px] border-l-warning animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="text-xs font-semibold text-warning uppercase tracking-wider">
              Contradiction Detected
            </h3>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{data.contradiction}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Findings */}
        {data.findings && data.findings.length > 0 && (
          <SectionCard title="Findings" icon={ListChecks}>
            <div className="space-y-2">
              {data.findings.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-text-tertiary font-mono text-xs mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <span className="text-text-primary">{f.finding}</span>
                    {f.value && (
                      <span className="text-text-secondary font-mono ml-2">— {f.value}</span>
                    )}
                    {f.reference && (
                      <span className="text-text-tertiary text-xs ml-2 italic">[{f.reference}]</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Confidence + breakdown */}
        {typeof data.confidence === 'number' && (
          <SectionCard title="Confidence" icon={Gauge}>
            <div className="space-y-3">
              <ConfidenceMeter value={data.confidence} />
              {data.confidence_breakdown && (
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  {Object.entries(data.confidence_breakdown).map(([key, val]) => (
                    <ConfidenceBreakdownBar key={key} label={key} value={val} />
                  ))}
                </div>
              )}
              {typeof data.retries === 'number' && data.retries > 0 && (
                <div className="text-xs text-text-tertiary pt-1">
                  Retries: <span className="font-mono text-warning">{data.retries}</span>
                </div>
              )}
            </div>
          </SectionCard>
        )}
      </div>

      {/* Evidence */}
      {data.evidence && data.evidence.length > 0 && (
        <SectionCard title="Evidence" icon={Search}>
          <div className="space-y-2">
            {data.evidence.map((ev, i) => (
              <div key={i} className="bg-surface-hover rounded-lg border border-border-subtle p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-text-tertiary" />
                    <span className="text-xs font-mono text-text-primary">{ev.document}</span>
                    <span className="text-xs text-text-tertiary">p.{ev.page}</span>
                    {ev.section && (
                      <span className="text-xs text-text-tertiary">· {ev.section}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-success">
                      {(ev.score * 100).toFixed(0)}%
                    </span>
                    {typeof ev.vector_score === 'number' && (
                      <span className="text-2xs text-text-tertiary font-mono">
                        vec {(ev.vector_score * 100).toFixed(0)}%
                      </span>
                    )}
                    {typeof ev.section_boost === 'number' && (
                      <span className="text-2xs text-text-tertiary font-mono">
                        boost {ev.section_boost.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Quote className="w-3 h-3 text-text-tertiary flex-shrink-0 mt-1" />
                  <p className="text-xs text-text-secondary leading-relaxed italic">{ev.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Checklist */}
      {data.checklist_items && data.checklist_items.length > 0 && (
        <SectionCard title="Checklist" icon={ListChecks}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider py-2 pr-4">
                    Point
                  </th>
                  <th className="text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider py-2 pr-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider py-2">
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.checklist_items.map((item, i) => {
                  return (
                    <tr
                      key={i}
                      className="border-b border-border-subtle last:border-0 hover:bg-surface-hover/50 transition-colors"
                    >
                      <td className="py-2.5 pr-4 text-text-primary">{item.point}</td>
                      <td className="py-2.5 pr-4">
                        <StatusBadge status={item.status} size="xs" />
                      </td>
                      <td className="py-2.5 text-text-secondary text-xs">
                        {item.remark || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
