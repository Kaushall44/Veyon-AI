import React, { useState, useEffect } from 'react';
import { Database, Plus, Search, Layers, ToggleLeft, ToggleRight, FileText, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { apiClient } from '../../services/api/apiClient';
import { DocumentUploadModal } from '../../components/admin/DocumentUploadModal';
import { ChunkInspectorModal } from '../../components/admin/ChunkInspectorModal';

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  effective_year: number;
  chunk_count: number;
  vector_dim: number;
  status: 'ACTIVE' | 'DEPRECATED';
  uploaded_by: string;
  uploaded_at: string;
  chunks?: any[];
}

export const KnowledgeBasePage: React.FC = () => {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([
    {
      id: 'DOC-1001',
      title: 'SOA_Academic_Regulations_2025.pdf',
      category: 'Academic Policy',
      effective_year: 2025,
      chunk_count: 84,
      vector_dim: 768,
      status: 'ACTIVE',
      uploaded_by: 'Dr. S. N. Panda (Dean Academics)',
      uploaded_at: '2025-08-10 10:30',
      chunks: [
        {
          chunk_id: 'CHUNK-1001-A',
          page: 4,
          text: 'Section 4.2: Course Prerequisite & Fast-Track Permits. Students maintaining above 85% attendance and CGPA >= 7.5 are eligible for fast-track lab permits.',
          vector_sample: [0.042, -0.198, 0.812, 0.301, -0.054],
          similarity_weight: 0.94,
        },
      ],
    },
    {
      id: 'DOC-1002',
      title: 'SOA_Lab_Guidelines_2025.pdf',
      category: 'Lab Operations',
      effective_year: 2025,
      chunk_count: 42,
      vector_dim: 768,
      status: 'ACTIVE',
      uploaded_by: 'Prof. A. K. Samanta (Lab In-Charge)',
      uploaded_at: '2025-09-01 14:15',
      chunks: [
        {
          chunk_id: 'CHUNK-1002-A',
          page: 2,
          text: 'Advanced AI & GPU Computing Lab (Room C-204) capacity: 30 NVIDIA RTX 4090 workstations.',
          vector_sample: [0.304, -0.112, 0.655, -0.091, 0.442],
          similarity_weight: 0.96,
        },
      ],
    },
    {
      id: 'DOC-1003',
      title: 'SOA_Hostel_Rules_2025.pdf',
      category: 'Estates & Housing',
      effective_year: 2025,
      chunk_count: 36,
      vector_dim: 768,
      status: 'ACTIVE',
      uploaded_by: 'Chief Warden Office',
      uploaded_at: '2025-07-20 09:00',
      chunks: [],
    },
    {
      id: 'DOC-1004',
      title: 'SOA_Examination_Circular_2024_Outdated.pdf',
      category: 'Examination',
      effective_year: 2024,
      chunk_count: 28,
      vector_dim: 768,
      status: 'DEPRECATED',
      uploaded_by: 'Controller of Examinations',
      uploaded_at: '2024-04-12 11:20',
      chunks: [],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [inspectDoc, setInspectDoc] = useState<KnowledgeDoc | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await apiClient.get('/knowledge/documents');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.log('Using local knowledge base documents catalog.');
    }
  };

  const handleToggleStatus = async (docId: string) => {
    try {
      await apiClient.post(`/knowledge/documents/${docId}/toggle-status`);
    } catch (err) {
      console.log('Toggled document status locally.');
    }

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, status: d.status === 'ACTIVE' ? 'DEPRECATED' : 'ACTIVE' }
          : d
      )
    );
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = documents.filter((d) => d.status === 'ACTIVE').length;
  const totalChunks = documents.reduce((acc, d) => acc + d.chunk_count, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" /> Grounded RAG Vector Catalog
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Knowledge Base Manager</h1>
          <p className="text-slate-300 text-xs sm:text-sm">Manage institutional policy PDFs, vector chunk embeddings, and active regulations.</p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Policy PDF</span>
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Total Policy PDFs</span>
            <span className="text-xl font-black text-slate-900">{documents.length} Files</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Active Documents</span>
            <span className="text-xl font-black text-slate-900">{activeCount} Regulations</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Vector Chunks (768-Dim)</span>
            <span className="text-xl font-black text-slate-900">{totalChunks} Chunks</span>
          </div>
        </div>
      </div>

      {/* Search & Document Catalog */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-sm">Indexed Institutional Documents</h3>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-72 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search document title or category..."
              className="bg-transparent border-none outline-none w-full text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Chunks (768-Dim)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">{doc.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {doc.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {doc.category} ({doc.effective_year})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-800">{doc.chunk_count} chunks</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(doc.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                        doc.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {doc.status === 'ACTIVE' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ACTIVE
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> DEPRECATED
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[11px] text-slate-600">
                      <span>{doc.uploaded_by}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{doc.uploaded_at}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setInspectDoc(doc)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition-all flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Chunks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={fetchDocuments}
      />

      {/* Vector Chunk Inspector Modal */}
      {inspectDoc && (
        <ChunkInspectorModal
          isOpen={Boolean(inspectDoc)}
          docTitle={inspectDoc.title}
          chunks={inspectDoc.chunks || []}
          onClose={() => setInspectDoc(null)}
        />
      )}
    </div>
  );
};

export default KnowledgeBasePage;
