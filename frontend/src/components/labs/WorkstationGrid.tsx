import React from 'react';
import { Monitor, Cpu, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, Lock } from 'lucide-react';

export interface WorkstationGridProps {
  totalSeats?: number;
  occupiedSeats: number[];
  selectedSeat: number | null;
  onSelectSeat: (seatNo: number) => void;
  gpuModel?: string;
  roomNo?: string;
  isFastTrack?: boolean;
}

export const WorkstationGrid: React.FC<WorkstationGridProps> = ({
  totalSeats = 30,
  occupiedSeats = [3, 7, 12, 18, 22],
  selectedSeat,
  onSelectSeat,
  gpuModel = 'NVIDIA RTX 4090 (24GB VRAM)',
  roomNo = 'Room C-204',
  isFastTrack = true,
}) => {
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-3xl border border-[#EAE7DF] p-6 sm:p-8 shadow-xs space-y-6 text-left">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE7DF] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] uppercase tracking-wider">
              {roomNo} Seat Allocator
            </span>
            {isFastTrack && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EAF6] text-[#283593] border border-[#C5CAE9] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#283593]" /> Fast-Track Enabled
              </span>
            )}
          </div>
          <h3 className="font-serif-title font-bold text-[#1B231F] text-lg sm:text-xl">
            Interactive Workstation Selection
          </h3>
          <p className="text-xs text-[#5A6E63]">
            Select your dedicated GPU computing node. Each seat is equipped with {gpuModel}.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#5A6E63] bg-[#FAF8F3] p-2.5 rounded-2xl border border-[#E5E2D9]">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-[#E8F5E9] border border-[#81C784]"></div>
            <span className="text-[11px]">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-[#152E22] border border-[#152E22] text-white"></div>
            <span className="text-[11px] font-bold text-[#152E22]">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-[#FFEBEE] border border-[#FFCDD2]"></div>
            <span className="text-[11px] text-[#C62828] font-bold">Occupied (Locked)</span>
          </div>
        </div>
      </div>

      {/* Screen / Instructor Podium Indicator */}
      <div className="max-w-md mx-auto py-1.5 px-4 rounded-xl bg-[#FAF8F3] border border-dashed border-[#D9D5C7] text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C9C92]">
          🖥️ FRONT OF ROOM / INSTRUCTOR CONSOLE &amp; SERVER RACK
        </span>
      </div>

      {/* 30-Workstation Grid (5 rows x 6 cols) */}
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 sm:gap-4 max-w-2xl mx-auto py-2">
        {seats.map((seatNo) => {
          const isOccupied = occupiedSeats.includes(seatNo);
          const isSelected = selectedSeat === seatNo;

          let seatStyle = 'bg-[#FAF8F3] border-[#E5E2D9] text-[#1B231F] hover:border-[#152E22] hover:bg-white hover:shadow-xs cursor-pointer';
          if (isOccupied) {
            seatStyle = 'bg-[#FFEBEE]/80 border-[#FFCDD2] text-[#C62828] cursor-not-allowed opacity-80';
          } else if (isSelected) {
            seatStyle = 'bg-[#152E22] border-[#152E22] text-white shadow-md ring-2 ring-[#2E7D32]/50 scale-105';
          }

          return (
            <button
              key={seatNo}
              type="button"
              disabled={isOccupied}
              onClick={() => onSelectSeat(seatNo)}
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 text-center group relative ${seatStyle}`}
              title={isOccupied ? `Workstation #${seatNo} is locked (already reserved)` : `Workstation #${seatNo} (Click to select)`}
            >
              {isOccupied ? (
                <Lock className="w-4 h-4 text-[#C62828]" />
              ) : (
                <Monitor className={`w-4 h-4 ${isSelected ? 'text-[#A5D6A7]' : 'text-[#5A6E63] group-hover:text-[#152E22]'}`} />
              )}
              <span className="text-[11px] font-bold tracking-tight">#{seatNo}</span>
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                  ✓
                </span>
              )}
              {isOccupied && (
                <span className="text-[8px] font-black uppercase text-[#C62828] tracking-tighter">
                  LOCKED
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Real-time Status Strip */}
      <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#152E22]" />
          <span className="text-[#5A6E63]">
            Selected: <strong className="text-[#1B231F]">{selectedSeat ? `Node #${selectedSeat} (${roomNo})` : 'None'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-4 text-[#5A6E63]">
          <span>Free Capacity: <strong className="text-[#2E7D32]">{totalSeats - occupiedSeats.length}/{totalSeats} Nodes</strong></span>
          <span>Locked: <strong className="text-[#C62828]">{occupiedSeats.length} Nodes</strong></span>
        </div>
      </div>
    </div>
  );
};

export default WorkstationGrid;
