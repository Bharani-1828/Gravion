import { NAV_ITEMS, type ViewId } from '@/lib/nav';
import { Plus, FolderKanban, Shapes, Code2, SlidersHorizontal, Search, MoreHorizontal, Palette } from 'lucide-react';

interface SidebarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  collapsed: boolean;
}

const workspaceItems = [
  { label: 'New', icon: Plus, view: 'command' as ViewId },
  { label: 'Projects', icon: FolderKanban, view: 'knowledge' as ViewId },
  { label: 'Artifacts', icon: Shapes, view: 'inspection' as ViewId },
  { label: 'Code', icon: Code2, view: 'codelab' as ViewId },
  { label: 'Customize', icon: SlidersHorizontal, view: 'settings' as ViewId },
];

const recentItems = [
  'GRAVION command center',
  'Equipment inspection review',
  'Industrial knowledge base',
];

export function Sidebar({ activeView, onNavigate, collapsed }: SidebarProps) {
  if (collapsed) {
    return (
      <aside className="w-16 bg-surface border-r border-border flex flex-col items-center flex-shrink-0 py-4 gap-3">
        <button onClick={() => onNavigate('command')} className="font-serif text-xl text-text-primary mb-3" title="Claude">
          C
        </button>
        {workspaceItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`p-2 rounded-lg transition-colors ${activeView === item.view ? 'bg-accent-light text-accent' : 'text-text-secondary hover:bg-surface-hover'}`}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside className="w-[280px] bg-surface border-r border-border flex flex-col flex-shrink-0 overflow-hidden">
      <div className="px-4 pt-3 pb-4 flex items-center justify-between">
        <button onClick={() => onNavigate('command')} className="font-serif text-[22px] text-text-primary tracking-tight">
          Claude
        </button>
        <div className="flex items-center gap-1 text-text-tertiary">
          <button className="p-1.5 rounded-md hover:bg-surface-hover transition-colors" title="Search">
            <Search className="w-[15px] h-[15px]" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-surface-hover transition-colors" title="More">
            <MoreHorizontal className="w-[15px] h-[15px]" />
          </button>
        </div>
      </div>

      <nav className="px-2 space-y-0.5">
        {workspaceItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view && item.label !== 'New';
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] transition-colors ${
                isActive ? 'bg-accent-light text-accent font-medium' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              <Icon className="w-[17px] h-[17px]" />
              <span>{item.label}</span>
              {item.label === 'Code' && <span className="ml-auto text-xs text-accent border border-accent/25 rounded-full px-2 py-0.5">Upgrade</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-7 px-4 flex items-center justify-between">
        <span className="text-[13px] text-text-secondary">Chats and tasks</span>
        <SlidersHorizontal className="w-3.5 h-3.5 text-text-tertiary" />
      </div>
      <div className="mt-2 px-2 space-y-0.5 overflow-y-auto flex-1">
        {recentItems.map((item, index) => (
          <button
            key={item}
            onClick={() => onNavigate(index === 1 ? 'inspection' : index === 2 ? 'knowledge' : 'command')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] truncate transition-colors ${
              (index === 0 && activeView === 'command') || (index === 1 && activeView === 'inspection') || (index === 2 && activeView === 'knowledge')
                ? 'bg-surface-hover text-text-primary'
                : 'text-text-secondary hover:bg-surface-hover'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full border border-text-tertiary flex-shrink-0" />
            <span className="truncate">{item}</span>
          </button>
        ))}
        {NAV_ITEMS.slice(3).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[13px] transition-colors ${activeView === item.id ? 'bg-surface-hover text-text-primary' : 'text-text-secondary hover:bg-surface-hover'}`}
            >
              <Icon className="w-3.5 h-3.5 text-text-tertiary" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-border p-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] text-text-secondary hover:bg-surface-hover transition-colors">
          <Palette className="w-4 h-4" />
          <span>Design</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface-hover transition-colors">
          <span className="w-7 h-7 rounded-full bg-[#d9e4d4] text-[#4e6b46] flex items-center justify-center text-[11px] font-semibold">GA</span>
          <span className="text-[13px] text-text-primary flex-1 truncate">Gravion Admin · Free</span>
          <span className="text-text-tertiary text-xs">⌄</span>
        </button>
      </div>
    </aside>
  );
}
