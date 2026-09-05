import { ComingSoonPanel, type ComingSoonProps } from '@/components/ComingSoonPanel';
import {
  Activity,
  Calculator,
  Bot,
  Code2,
  ClipboardCheck,
  ScrollText,
  Shield,
  Settings,
} from 'lucide-react';

const PAGES: Record<string, ComingSoonProps> = {
  telemetry: {
    title: 'Telemetry',
    subtitle: 'Real-time sensor data ingestion, trend analysis, and anomaly detection.',
    status: 'REQUIRES BACKEND',
    icon: Activity,
    bullets: [
      'CSV / XLSX ingestion for vibration, temperature, and pressure datasets',
      'Interactive trend charts with configurable time windows',
      'Statistical anomaly detection with configurable thresholds',
      'Multi-sensor correlation and overlay views',
      'Export to engineering report format',
    ],
  },
  engineering: {
    title: 'Engineering',
    subtitle: 'Computational tools for industrial engineering calculations.',
    status: 'REQUIRES BACKEND',
    icon: Calculator,
    bullets: [
      'Thermodynamic property lookups and cycle analysis',
      'Heat exchanger sizing and LMTD calculations',
      'Pipe flow and pressure drop computations',
      'Mechanical integrity and stress calculations',
      'Unit conversion across industrial standards',
    ],
  },
  agents: {
    title: 'Agents',
    subtitle: 'Configure and monitor autonomous AI agents for industrial workflows.',
    status: 'REQUIRES BACKEND',
    icon: Bot,
    bullets: [
      'Agent registry with role, tools, and permission scopes',
      'Live agent status and task assignment tracking',
      'Multi-agent orchestration with dependency graphs',
      'Per-agent execution logs and performance metrics',
      'Approval gates for safety-critical agent actions',
    ],
  },
  codelab: {
    title: 'Code Lab',
    subtitle: 'Sandboxed code execution for industrial data analysis scripts.',
    status: 'REQUIRES BACKEND',
    icon: Code2,
    bullets: [
      'Sandboxed Python execution environment with NumPy / Pandas',
      'Pre-loaded industrial dataset connectors',
      'Script library with reusable analysis templates',
      'Output visualization and table rendering',
      'Audit-logged execution with immutable run history',
    ],
  },
  approvals: {
    title: 'Approvals',
    subtitle: 'Human-in-the-loop approval workflow for agent-initiated actions.',
    status: 'NOT CONFIGURED',
    icon: ClipboardCheck,
    bullets: [
      'Pending approval queue with priority and expiry',
      'Context-rich approval cards with evidence traces',
      'Approve, reject, or request-more-information actions',
      'Approval delegation and escalation rules',
      'Full audit trail of all approval decisions',
    ],
  },
  audit: {
    title: 'Audit',
    subtitle: 'Immutable record of all AI actions, queries, and system events.',
    status: 'REQUIRES BACKEND',
    icon: ScrollText,
    bullets: [
      'Chronological event log with tamper-evident hashing',
      'Filter by agent, user, action type, and time range',
      'Detailed event inspector with full request/response payloads',
      'Compliance export to CSV and PDF formats',
      'Real-time audit stream with alerting on anomalous patterns',
    ],
  },
  sovereignty: {
    title: 'Sovereignty',
    subtitle: 'Data sovereignty, network isolation, and deployment governance.',
    status: 'NOT CONFIGURED',
    icon: Shield,
    bullets: [
      'Network egress monitor with blocked-connection log',
      'Data residency and classification dashboard',
      'Model provenance and version tracking',
      'Key management and encryption status overview',
      'Deployment topology and isolation boundary visualization',
    ],
  },
  settings: {
    title: 'Settings',
    subtitle: 'System configuration, model selection, and operational parameters.',
    status: 'NOT CONFIGURED',
    icon: Settings,
    bullets: [
      'Local model selection and parameter tuning',
      'RAG index configuration and chunking strategy',
      'Vision model threshold and confidence calibration',
      'User and role management',
      'System diagnostics and health checks',
    ],
  },
};

export function PlaceholderPage({ pageId }: { pageId: string }) {
  const props = PAGES[pageId];
  if (!props) return null;
  return <ComingSoonPanel {...props} />;
}
