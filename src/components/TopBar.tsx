import { FileText, Share2, MoreHorizontal, ChevronDown, PanelLeft } from 'lucide-react';
import type { ViewId } from '@/lib/nav';

interface TopBarProps {
  onToggleSidebar: () => void;
  activeView: ViewId;
}

const titles: Record<ViewId, string> = {
  command: 'GRAVION command center',
  knowledge: 'Industrial knowledge base',
  inspection: 'Equipment inspection review',
  telemetry: 'Telemetry',
  engineering: 'Engineering',
  agents: 'Agents',
  codelab: 'Code Lab',
  approvals: 'Approvals',
  audit: 'Audit',
  sovereignty: 'Sovereignty',
  settings: 'Settings',
};

export function TopBar({ onToggleSidebar, activeView }: TopBarProps) {
  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onToggleSidebar} className="p-1.5 rounded-lg hover:bg-surface-hover text-text-secondary transition-colors lg:hidden">
          <PanelLeft className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 text-[14px] text-text-primary font-medium truncate hover:bg-surface-hover rounded-lg px-2 py-1.5 transition-colors">
          <span className="truncate">{titles[activeView]}</span>
          <ChevronDown className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-surface-hover px-2.5 py-1.5 text-xs text-text-secondary">
          Free plan · <span className="text-accent underline underline-offset-2">Upgrade</span>
        </span>
        <button className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors" title="Artifacts">
          <FileText className="w-4 h-4" />
        </button>
        <button className="inline-flex items-center gap-1.5 border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary hover:bg-surface-hover transition-colors">
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
