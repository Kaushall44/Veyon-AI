import React from 'react';
import { X, Layers, Database, Sparkles, Code2 } from 'lucide-react';

interface ChunkData {
  chunk_id: string;
  page: number;
  text: string;
  vector_sample: number[];
  similarity_weight: number;
}

interface ChunkInspectorModalProps {
  isOpen: boolean;
  docTitle: string;
  chunks: ChunkData[];
  onClose: () => void;
}

export const ChunkInspectorModal: React.FC<ChunkInspectorModalProps> = ({
  isOpen,
  docTitle,
  chunks,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-modal border border-slate-200 space-y-5 max-h-[85vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Vector Chunk Inspector</h3>
              <p className="text-[11px] text-slate-500 font-mono">{docTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chunks Stream */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {chunks.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No chunks indexed yet for this document.</p>
          ) : (
            chunks.map((c) => (
              <div key={c.chunk_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">
                      {c.chunk_id}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">Page {c.page}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                    RAG Weight: {(c.similarity_weight * 100).toFixed(0)}%
                  </span>
                </div>

                <p className="text-slate-800 leading-relaxed font-sans text-xs bg-white p-3 rounded-lg border border-slate-200">
                  "{c.text}"
                </p>

                {/* 768-dim Vector Sample */}
                <div className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[10px] space-y-1">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 uppercase tracking-wider">
                    <span>768-Dim Dense Embedding Vector (Float32)</span>
                    <span>Vector Dim: 768</span>
                  </div>
                  <div className="text-slate-300 overflow-x-auto whitespace-nowrap">
                    [{c.vector_sample.join(', ')}, ... +763 dimensions]
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
