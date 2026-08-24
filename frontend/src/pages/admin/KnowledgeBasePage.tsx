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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#1B231F] text-left">
      {/* Header Banner (S1 Design System) */}
      <div className="bg-[#152E22] text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-widest flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#E8F5E9]" /> Grounded RAG Vector Catalog
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-white leading-tight">Knowledge Base Manager</h1>
          <p className="text-[#8C9C92] text-xs font-medium">Manage institutional policy PDFs, vector chunk embeddings, and active regulations.</p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-5 py-2.5 rounded-full bg-white text-[#152E22] hover:bg-[#FAF8F3] text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Policy PDF</span>
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#EAE7DF] shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#5A6E63] block">Total Policy PDFs</span>
            <span className="text-xl font-bold font-serif-title text-[#1B231F]">{documents.length} Files</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EAE7DF] shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#5A6E63] block">Active Documents</span>
            <span className="text-xl font-bold font-serif-title text-[#1B231F]">{activeCount} Regulations</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EAE7DF] shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#F3E5F5] text-[#6A1B9A] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#5A6E63] block">Vector Chunks (768-Dim)</span>
            <span className="text-xl font-bold font-serif-title text-[#1B231F]">{totalChunks} Chunks</span>
          </div>
        </div>
      </div>

      {/* Search & Document Catalog */}
      <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#EAE7DF] pb-4">
          <h3 className="font-bold text-[#1B231F] text-xs uppercase tracking-wider">Indexed Institutional Documents</h3>

          <div className="flex items-center gap-2 bg-[#FAF8F3] border border-[#D9D5C7] rounded-full px-4 py-2 w-full sm:w-72 text-xs">
            <Search className="w-4 h-4 text-[#8C9C92]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search document title or category..."
              className="bg-transparent border-none outline-none w-full text-[#1B231F] placeholder-[#8C9C92] font-medium"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-[#EAE7DF] text-[#5A6E63] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Chunks (768-Dim)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE7DF] font-medium">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#FAF8F3] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#152E22] shrink-0" />
                      <div>
                        <span className="font-bold text-[#1B231F] block leading-tight">{doc.title}</span>
                        <span className="text-[10px] text-[#8C9C92] font-mono">ID: {doc.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF8F3] text-[#5A6E63] border border-[#E5E2D9]">
                      {doc.category} ({doc.effective_year})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#152E22]">{doc.chunk_count} chunks</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(doc.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                        doc.status === 'ACTIVE'
                          ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                          : 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
                      }`}
                    >
                      {doc.status === 'ACTIVE' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" /> ACTIVE
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-[#F57F17]" /> DEPRECATED
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[11px] text-[#5A6E63]">
                      <span>{doc.uploaded_by}</span>
                      <span className="text-[10px] text-[#8C9C92] block font-mono">{doc.uploaded_at}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setInspectDoc(doc)}
                      className="px-3.5 py-1.5 rounded-full bg-[#FAF8F3] hover:bg-[#EFECE3] text-[#152E22] border border-[#E5E2D9] font-bold text-xs transition-all flex items-center gap-1 ml-auto cursor-pointer"
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
