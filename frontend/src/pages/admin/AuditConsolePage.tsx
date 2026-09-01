import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, Download, Code2, RefreshCw, Layers, Database } from 'lucide-react';
import { AuditJsonViewerModal } from '../../components/admin/AuditJsonViewerModal';
import { apiClient } from '../../services/api/apiClient';

export const AuditConsolePage: React.FC = () => {
  const [selectedEventType, setSelectedEventType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectRecord, setInspectRecord] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAuditLogs = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (selectedEventType !== 'ALL') params.event_type = selectedEventType;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      
      const res = await apiClient.get('/audit/logs', { params });
      if (Array.isArray(res.data) && res.data.length > 0) {
        setAuditLogs(res.data);
      }
    } catch (err) {
      console.log('Loading fallback audit logs...');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [selectedEventType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAuditLogs();
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesEvent = selectedEventType === 'ALL' || log.event_type === selectedEventType || log.action_type === selectedEventType;
    const matchesSearch =
      searchQuery === '' ||
      (log.audit_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.action_summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.actor_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.event_type || log.action_type || '').toLowerCase().includes(searchQuery.toLowerCase());

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
      const summary = (l.action_summary || '').replace(/"/g, '""');
      csvRows.push(`${l.audit_id},${l.timestamp},${l.actor_id},${l.event_type || l.action_type},${l.request_id},"${summary}"`);
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
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" />
              PostgreSQL Write-Only & Supabase Synced
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">
            Immutable Audit Trail & Telemetry
          </h1>
          <p className="text-[#8C9C92] text-xs font-medium max-w-xl">
            Append-only cryptographic ledger tracking 100% of user prompts, NLU intent detections, policy RAG scores, ReAct plans, HITL approvals, and backend tool mutations.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={fetchAuditLogs}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2"
            title="Refresh Audit Logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
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
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C9C92] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit ID, summary, or prompt..."
            className="w-full bg-[#FAF8F3] border border-[#D9D5C7] rounded-full pl-9 pr-4 py-2 text-xs text-[#1B231F] placeholder-[#8C9C92] outline-none focus:border-[#152E22] font-medium"
          />
        </form>

        {/* Event Type Filter */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#8C9C92] shrink-0" />
          <span className="font-bold text-[#1B231F] shrink-0">Event Type:</span>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="bg-[#FAF8F3] border border-[#D9D5C7] rounded-full px-4 py-2 font-bold text-[#152E22] focus:outline-none w-full sm:w-auto"
          >
            <option value="ALL">All Event Types ({filteredLogs.length} Records)</option>
            <option value="CHAT_PROMPT">CHAT_PROMPT</option>
            <option value="INTENT_DETECTED">INTENT_DETECTED</option>
            <option value="RAG_RETRIEVAL">RAG_RETRIEVAL</option>
            <option value="PLAN_GENERATED">PLAN_GENERATED</option>
            <option value="HITL_APPROVAL_GRANTED">HITL_APPROVAL_GRANTED</option>
            <option value="APPROVAL_APPROVED">APPROVAL_APPROVED</option>
            <option value="APPROVAL_REJECTED">APPROVAL_REJECTED</option>
            <option value="TOOL_EXECUTED">TOOL_EXECUTED</option>
            <option value="LAB_BOOKING_CREATED">LAB_BOOKING_CREATED</option>
            <option value="MAINTENANCE_CREATED">MAINTENANCE_CREATED</option>
            <option value="GRIEVANCE_CREATED">GRIEVANCE_CREATED</option>
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
              {filteredLogs.map((log) => {
                const eventName = log.event_type || log.action_type || 'SYSTEM_EVENT';
                return (
                  <tr key={log.audit_id || log.id} className="hover:bg-[#FAF8F3] transition-colors">
                    <td className="p-4 sm:px-6 font-mono font-bold text-[#152E22]">{log.audit_id || log.id}</td>
                    <td className="p-4 text-[#8C9C92] font-mono text-[11px] whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-4 font-bold text-[#1B231F]">{log.actor_id || 'System'}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                          eventName.includes('TOOL') || eventName.includes('CREATED')
                            ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                            : eventName.includes('APPROVAL') || eventName.includes('APPROVED')
                            ? 'bg-[#E8EAF6] text-[#283593] border-[#C5CAE9]'
                            : eventName.includes('RAG')
                            ? 'bg-[#F3E5F5] text-[#6A1B9A] border-[#E1BEE7]'
                            : 'bg-[#EFECE3] text-[#5A6E63] border-[#D9D5C7]'
                        }`}
                      >
                        {eventName}
                      </span>
                    </td>
                    <td className="p-4 text-[#5A6E63] max-w-md truncate">{log.action_summary || `Recorded ${eventName}`}</td>
                    <td className="p-4 sm:pr-6 text-right">
                      <button
                        onClick={() => setInspectRecord(log)}
                        className="px-3.5 py-1.5 rounded-full bg-[#FAF8F3] hover:bg-[#EFECE3] text-[#152E22] font-bold border border-[#E5E2D9] transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5" /> Inspect JSON
                      </button>
                    </td>
                  </tr>
                );
              })}
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
