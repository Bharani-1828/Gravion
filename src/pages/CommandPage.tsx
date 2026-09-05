import { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Paperclip,
  Sparkles,
  ScanLine,
  FileSearch,
  Activity,
  Calculator,
  FileBarChart,
  Code2,
  BookOpen,
  Check,
  Loader2,
  Bot,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { postCommand, type CommandResponse } from '@/lib/api';
import { CommandResponseView } from '@/components/CommandResponseView';
import type { TimelineStep } from '@/components/ActivityTimeline';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  response?: CommandResponse;
  loading?: boolean;
  error?: string;
}

const SUGGESTIONS = [
  { icon: FileSearch, label: 'Analyze Document', prompt: 'Analyze Document', color: 'text-accent' },
  { icon: ScanLine, label: 'Inspect Equipment', prompt: 'Inspect Equipment', color: 'text-success' },
  { icon: Activity, label: 'Analyze Telemetry', prompt: 'Analyze Telemetry', color: 'text-info' },
  { icon: Calculator, label: 'Calculate Engineering Value', prompt: 'Calculate Engineering Value', color: 'text-warning' },
  { icon: FileBarChart, label: 'Generate Report', prompt: 'Generate Report', color: 'text-accent' },
  { icon: Code2, label: 'Run Code', prompt: 'Run Code', color: 'text-info' },
  { icon: BookOpen, label: 'Search Knowledge', prompt: 'Search Knowledge', color: 'text-success' },
];

const ALL_STEPS: TimelineStep[] = [
  { label: 'Command received', done: false },
  { label: 'Intent identified', done: false },
  { label: 'Task classified', done: false },
  { label: 'Agent selected', done: false },
  { label: 'Tool executed', done: false },
  { label: 'Evidence retrieved', done: false },
  { label: 'Result validated', done: false },
];

function buildTimeline(data: CommandResponse): TimelineStep[] {
  const steps = ALL_STEPS.map((s) => ({ ...s }));
  steps[0].done = true;
  if (data.command) steps[1].done = true;
  if (data.task_type) steps[2].done = true;
  if (data.agents && data.agents.length > 0) steps[3].done = true;
  if (data.message) steps[4].done = true;
  if (data.evidence && data.evidence.length > 0) steps[5].done = true;
  if (typeof data.confidence === 'number' || (data.checklist_items && data.checklist_items.length > 0))
    steps[6].done = true;
  return steps;
}

let msgId = 0;
const genId = () => `msg-${++msgId}`;

export function CommandPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { id: genId(), role: 'user', text };
    const assistantMsg: ChatMessage = { id: genId(), role: 'assistant', text: '', loading: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await postCommand(text);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, loading: false, text: data.message, response: data }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, loading: false, error: err instanceof Error ? err.message : 'Command failed' }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleSuggestion(prompt: string) {
    sendMessage(prompt);
  }

  const handleRetry = (msgId: string, text: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, loading: true, error: undefined } : m))
    );
    postCommand(text)
      .then((data) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, loading: false, text: data.message, response: data, error: undefined } : m
          )
        );
      })
      .catch((err) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, loading: false, error: err instanceof Error ? err.message : 'Command failed' } : m
          )
        );
      });
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Conversation area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="h-full flex flex-col items-center justify-center px-6">
            {/* Welcome */}
            <div className="w-full max-w-[720px] flex flex-col items-center text-center pb-32">
              <div className="w-12 h-12 rounded-2xl bg-accent-light border border-accent/20 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h1 className="font-serif text-[28px] text-text-primary mb-2 tracking-tight">
                How can I help with your industrial operations?
              </h1>
              <p className="text-sm text-text-secondary mb-8">
                Ask GRAVION to analyze, inspect, calculate, or execute.
              </p>

              {/* Suggestion cards */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.label}
                      onClick={() => handleSuggestion(s.prompt)}
                      disabled={loading}
                      className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-surface hover:border-accent/40 hover:shadow-soft transition-all text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center flex-shrink-0">
                        <Icon className={`w-4 h-4 ${s.color}`} />
                      </div>
                      <span className="text-sm text-text-primary font-medium flex-1">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[760px] mx-auto px-6 py-8 space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-fade-in">
                {msg.role === 'user' ? (
                  /* User message */
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-accent-light rounded-2xl rounded-tr-md px-4 py-2.5">
                      <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  /* Assistant message */
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-light border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {msg.loading ? (
                        <div className="flex items-center gap-2 py-2">
                          <Loader2 className="w-4 h-4 text-accent animate-spin" />
                          <span className="text-sm text-text-secondary">GRAVION is processing your command…</span>
                        </div>
                      ) : msg.error ? (
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 py-2">
                            <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-danger">Command Unavailable</p>
                              <p className="text-sm text-text-secondary mt-1">{msg.error}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRetry(msg.id, messages.find((m) => m.id === msg.id + 1)?.text || '')}
                            className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Try again
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Timeline */}
                          {msg.response && (
                            <div className="flex flex-wrap items-center gap-2">
                              {buildTimeline(msg.response).map((step, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                  {step.done ? (
                                    <div className="w-4 h-4 rounded-full bg-success-light border border-success/30 flex items-center justify-center">
                                      <Check className="w-2.5 h-2.5 text-success" />
                                    </div>
                                  ) : (
                                    <div className="w-4 h-4 rounded-full bg-surface-hover border border-border" />
                                  )}
                                  <span className={`text-xs ${step.done ? 'text-text-secondary' : 'text-text-tertiary'}`}>
                                    {step.label}
                                  </span>
                                  {i < ALL_STEPS.length - 1 && <span className="text-border mx-0.5">→</span>}
                                </div>
                              ))}
                            </div>
                          )}
                          {msg.response && <CommandResponseView data={msg.response} />}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="flex-shrink-0 pb-4 px-6">
        <div className="max-w-[760px] mx-auto">
          <div className="bg-surface border border-border rounded-2xl shadow-card overflow-hidden">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask GRAVION to analyze, inspect, calculate or execute…"
              rows={1}
              disabled={loading}
              className="w-full bg-transparent px-4 pt-3.5 pb-1 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none resize-none disabled:opacity-50"
              style={{ maxHeight: '200px' }}
            />
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-colors" title="Attach">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-colors" title="Tools">
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-text-tertiary mt-2">
            GRAVION AI can make mistakes. Verify critical industrial results independently.
          </p>
        </div>
      </div>
    </div>
  );
}
