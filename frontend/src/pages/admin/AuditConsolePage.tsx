import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Download, Code2, ExternalLink, RefreshCw, FileText } from 'lucide-react';
import { AuditJsonViewerModal } from '../../components/admin/AuditJsonViewerModal';

export const AuditConsolePage: React.FC = () => {
  const [selectedEventType, setSelectedEventType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectRecord, setInspectRecord] = useState<any | null>(null);

  // Initial 50+ benchmark audit trail entries
  const [auditLogs] = useState<any[]>(() => {
    const logs: any[] = [
      {
        audit_id: 'AUD-88391',
        timestamp: '2026-08-23 14:00:15',
        actor_id: 'Rahul Sharma (2023-CSE-042)',
        actor_role: 'Student',
        event_type: 'TOOL_EXECUTED',
        request_id: '50000000-0000-0000-0000-000000000001',
        action_summary: 'Executed commit_lab_booking() tool for Advanced AI Lab C-204',
        provenance_json: {
          audit_id: 'AUD-88391',
          request_id: '50000000-0000-0000-0000-000000000001',
          timestamp: '2026-08-23T14:00:15Z',
          raw_user_prompt: 'I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project.',
          nlu_pipeline: {
            detected_intent: 'LAB_BOOKING',
            confidence_score: 0.98,
            extracted_entities: {
              lab_id: 'LAB-AI-101',
              lab_name: 'Advanced AI & GPU Computing Lab',
              room_no: 'C-204',
              date: '2026-08-24',
              start_time: '14:00',
              end_time: '16:00',
            },
          },
          rag_provenance: {
            queried_policy: 'SOA_Lab_Guidelines_2025.txt',
            retrieved_chunk_id: 'CHUNK-LAB-012',
            vector_similarity_score: 0.92,
            bm25_relevance_score: 0.88,
            hybrid_score: 0.908,
          },
          react_plan: {
            risk_level: 'HIGH',
            requires_approval: true,
            assigned_approver_role: 'Lab_In_Charge',
            steps_passed: [
              'Check Student Course Prerequisites (CS301 Passed)',
              'Verify Lab Slot Availability (25/30 Free Seats)',
            ],
          },
          hitl_governance: {
            approval_id: '80000000-0000-0000-0000-000000000001',
            approver: 'Prof. A. K. Samanta (Lab In-Charge)',
            decision: 'APPROVED',
            approved_at: '2026-08-23T14:02:10Z',
          },
          tool_execution: {
            tool_name: 'commit_lab_booking',
            arguments: {
              lab_id: 'LAB-AI-101',
              date: '2026-08-24',
              start_time: '14:00',
              end_time: '16:00',
            },
            result: {
              booking_id: 'BK-60001',
              access_pass_code: 'PASS-LAB-AI-88192',
              qr_payload: 'SOA-NEXUS-PASS|PASS-LAB-AI-88192|LAB-AI-101|2026-08-24|14:00-16:00|Kaushal Raj Gupta',
            },
          },
        },
      },
    ];

    const eventTypes = ['CHAT_PROMPT', 'INTENT_DETECTED', 'RAG_RETRIEVAL', 'PLAN_GENERATED', 'HITL_APPROVAL_GRANTED', 'TOOL_EXECUTED'];
    const intents = ['LAB_BOOKING', 'CERTIFICATE', 'MAINTENANCE', 'GRIEVANCE', 'FAQ'];

    for (let i = 2; i <= 50; i++) {
      const evt = eventTypes[i % eventTypes.length];
      const intent = intents[i % intents.length];
      const auditCode = `AUD-88${390 + i}`;
      const reqId = `50000000-0000-0000-0000-${String(i).padStart(12, '0')}`;
      const nowStr = `2026-08-23 13:${String(i % 55).padStart(2, '0')}:10`;

      logs.push({
        audit_id: auditCode,
        timestamp: nowStr,
        actor_id: 'Rahul Sharma (2023-CSE-042)',
        actor_role: 'Student',
        event_type: evt,
        request_id: reqId,
        action_summary: `Audit log record #${i} for workflow event '${evt}' [Intent: ${intent}]`,
        provenance_json: {
          audit_id: auditCode,
          request_id: reqId,
          timestamp: nowStr,
          event_type: evt,
          nlu_pipeline: {
            detected_intent: intent,
            confidence_score: 0.95,
            extracted_entities: {
              lab_id: 'LAB-AI-101',
              lab_name: 'Advanced AI & GPU Computing Lab',
              room_no: 'C-204',
              date: '2026-08-24',
              start_time: '14:00',
              end_time: '16:00',
            },
          },
          system_provenance: {
            node: 'SOA-Nexus-AI-Core-01',
            integrity_hash: `SHA256-${Math.random().toString(36).substring(2, 14)}`,
          },
        },
      });
    }

    return logs;
  });

  const filteredLogs = auditLogs.filter((log) => {
    const matchesEvent = selectedEventType === 'ALL' || log.event_type === selectedEventType;
    const matchesSearch =
      searchQuery === '' ||
      log.audit_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.event_type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesEvent && matchesSearch;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'soa_nexus_audit_trail.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const csvRows = ['audit_id,timestamp,actor_id,event_type,request_id,action_summary'];
    filteredLogs.forEach((l) => {
      csvRows.push(`${l.audit_id},${l.timestamp},${l.actor_id},${l.event_type},${l.request_id},"${l.action_summary}"`);
    });
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'soa_nexus_audit_trail.csv');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* Header Banner (S1 Design System) */}
      <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8F5E9]" /> Admin Audit Console
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
            Immutable Audit Trail & AI Provenance
          </h1>
          <p className="text-[#8C9C92] text-xs font-medium max-w-xl">
            Inspect 100% of user prompts, intent scores, policy RAG passages, ReAct execution plans, HITL approvals, and tool execution payloads.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#EAE7DF] shadow-xs">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C9C92] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit ID, summary, or prompt..."
            className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-full pl-9 pr-4 py-2 text-xs text-[#1B231F] placeholder-[#8C9C92] outline-none focus:border-[#152E22] font-medium"
          />
        </div>

        {/* Event Type Filter */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#8C9C92] shrink-0" />
          <span className="font-bold text-[#1B231F] shrink-0">Event Type:</span>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="bg-[#FAF8F3] border border-[#D9D5C7] rounded-full px-4 py-2 font-bold text-[#152E22] focus:outline-none w-full sm:w-auto"
          >
            <option value="ALL">All Event Types (50 Logs)</option>
            <option value="CHAT_PROMPT">CHAT_PROMPT</option>
            <option value="INTENT_DETECTED">INTENT_DETECTED</option>
            <option value="RAG_RETRIEVAL">RAG_RETRIEVAL</option>
            <option value="PLAN_GENERATED">PLAN_GENERATED</option>
            <option value="HITL_APPROVAL_GRANTED">HITL_APPROVAL_GRANTED</option>
            <option value="TOOL_EXECUTED">TOOL_EXECUTED</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#EAE7DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[#FAF8F3] text-[#5A6E63] uppercase tracking-wider font-bold border-b border-[#EAE7DF]">
              <tr>
                <th className="p-4 sm:px-6">Audit ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Action Summary</th>
                <th className="p-4 sm:pr-6 text-right">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE7DF] font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.audit_id} className="hover:bg-[#FAF8F3] transition-colors">
                  <td className="p-4 sm:px-6 font-mono font-bold text-[#152E22]">{log.audit_id}</td>
                  <td className="p-4 text-[#8C9C92] font-mono text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4 font-bold text-[#1B231F]">{log.actor_id}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        log.event_type === 'TOOL_EXECUTED'
                          ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                          : log.event_type === 'HITL_APPROVAL_GRANTED'
                          ? 'bg-[#E8EAF6] text-[#283593] border-[#C5CAE9]'
                          : log.event_type === 'RAG_RETRIEVAL'
                          ? 'bg-[#F3E5F5] text-[#6A1B9A] border-[#E1BEE7]'
                          : 'bg-[#EFECE3] text-[#5A6E63] border-[#D9D5C7]'
                      }`}
                    >
                      {log.event_type}
                    </span>
                  </td>
                  <td className="p-4 text-[#5A6E63] max-w-md truncate">{log.action_summary}</td>
                  <td className="p-4 sm:pr-6 text-right">
                    <button
                      onClick={() => setInspectRecord(log)}
                      className="px-3.5 py-1.5 rounded-full bg-[#FAF8F3] hover:bg-[#EFECE3] text-[#152E22] font-bold border border-[#E5E2D9] transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5" /> Inspect JSON
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Viewer Modal */}
      <AuditJsonViewerModal
        auditRecord={inspectRecord}
        onClose={() => setInspectRecord(null)}
      />
    </div>
  );
};

export default AuditConsolePage;
