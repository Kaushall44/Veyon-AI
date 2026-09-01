import React from 'react';
import { Download, Printer, ShieldCheck } from 'lucide-react';

export interface OfficialBonafideCertificateProps {
  studentName?: string;
  fatherName?: string;
  registrationNo?: string;
  branch?: string;
  academicYear?: string;
  academicSession?: string;
  batch?: string;
  programmeYears?: string;
  purpose?: string;
  refNo?: string;
  issueDate?: string;
  annualFee?: string;
  onDownload?: () => void;
}

export const OfficialBonafideCertificate: React.FC<OfficialBonafideCertificateProps> = ({
  studentName = 'Kaushal Raj Gupta',
  fatherName = 'Rajesh Sharma',
  registrationNo = '24E042',
  branch = 'Computer Science and Engineering',
  academicYear = '2nd',
  academicSession = '2025-2026',
  batch = '2024 - 2025',
  programmeYears = 'four year(2024-2028)',
  purpose = 'Jharkhand state e Kalyan Scholarship',
  refNo = 'ITER/SOA/219',
  issueDate = '27.01.2026',
  annualFee = 'Rs. 2, 75,000/-',
  onDownload,
}) => {
  return (
    <div className="bg-[#FAF9F6] p-2 sm:p-4 md:p-6 rounded-3xl border border-[#E5E2D9] w-full max-w-4xl mx-auto space-y-4 text-left font-serif text-[#111827] shadow-xl relative overflow-hidden">
      {/* Action Header Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#E0DDD2] pb-3 no-print font-sans">
        <div className="flex items-center gap-2 text-xs font-bold text-[#152E22] text-center sm:text-left">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
          <span>Official SOA ITER Verified Document (Ref: {refNo})</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FAF8F3] text-xs font-bold text-[#1B231F] border border-[#D9D5C7] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            type="button"
            onClick={onDownload || (() => window.print())}
            className="px-4 py-1.5 rounded-full bg-[#152E22] hover:bg-[#1E3A2B] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Official PDF
          </button>
        </div>
      </div>

      {/* The Exact Printable Certificate Sheet (A4 Proportion) */}
      <div className="bg-[#FFFDF9] border border-[#D1D5DB] p-4 sm:p-8 md:p-10 rounded-2xl shadow-sm relative space-y-4 print:p-0 print:border-none print:shadow-none print:bg-white select-text overflow-hidden">
        {/* Authentic Center Watermark (Semi-Transparent SOA Red Circular Stamp) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] select-none overflow-hidden">
          <img
            src="/soa_logo.svg"
            alt="Watermark"
            className="w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 object-contain pointer-events-none"
          />
        </div>

        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4 border-b-0 pb-1 relative z-10">
          {/* Authentic High-Res Vector University Logo */}
          <div className="shrink-0 flex items-center justify-center">
            <img
              src="/soa_logo.svg"
              alt="Siksha 'O' Anusandhan Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain shrink-0"
            />
          </div>

          {/* Institution Title with Authentic Black / Crimson 'O' Color Scheme */}
          <div className="text-center flex-1 space-y-0.5 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3.5xl font-black tracking-wide text-[#111827] uppercase font-serif leading-tight">
              SIKSHA <span className="text-[#E11D48]">&apos;O&apos;</span> ANUSANDHAN
            </h1>
            <p className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-[#1F2937] leading-tight">
              (A Deemed to be University declared u/s 3 of UGC Act, 1956)
            </p>
            <p className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-[#374151] leading-tight">
              Accredited (3rd Cycle) by NAAC with A++ Grade
            </p>
          </div>

          {/* Reference & Date with Authentic Handwritten Ink Styling */}
          <div className="flex sm:flex-col justify-between sm:text-right w-full sm:w-auto text-xs sm:text-sm font-bold text-[#1F2937] shrink-0 space-y-0.5 sm:space-y-1 sm:pt-1 font-serif">
            <div>Ref: <span className="font-mono text-sm underline decoration-dotted">{refNo}</span></div>
            <div>Date: <span className="font-mono text-sm underline decoration-dotted">{issueDate}</span></div>
          </div>
        </div>

        {/* 2. Certificate Title Bar */}
        <div className="border-t-2 border-b-2 border-black py-1.5 sm:py-2 my-2 text-center relative z-10">
          <h2 className="text-base sm:text-lg md:text-xl font-black tracking-wider uppercase text-black">
            FEE STRUCTURE CERTIFICATE
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase mt-0.5 text-black">
            FOR B. TECH. PROGRAMME {batch} BATCH
          </p>
        </div>

        {/* 3. Certification Body Text */}
        <div className="text-xs sm:text-sm md:text-[14px] leading-relaxed text-justify space-y-2.5 relative z-10 text-[#111827]">
          <p>
            This is to certify that Mr./Ms. <strong>{studentName}</strong> S/D/o <strong>{fatherName}</strong> bearing Registration No <strong>{registrationNo}</strong> is a bonafide student of Faculty of Engineering and Technology (Institute of Technical Education & Research), Siksha &apos;O&apos; Anusandhan Deemed to be University and studying in <strong>{academicYear}</strong> year in <strong>B. Tech. – {branch}</strong> branch during the academic session <strong>{academicSession}</strong>. This certificate is issued for applying <strong>{purpose}</strong>.
          </p>
          <p>
            Year-wise expenditure for his/her studies in {programmeYears} B. Tech. Programme is given below.
          </p>
        </div>

        {/* 4. Detailed Fee Breakdown Table */}
        <div className="text-xs sm:text-[13px] md:text-[13.5px] leading-snug space-y-2 relative z-10 pt-1 text-[#111827]">
          {/* Current Year Course Fee */}
          <div className="flex justify-between items-center py-1 font-semibold gap-2">
            <span>{academicYear} Year Annual course fee</span>
            <span className="font-mono font-bold shrink-0">{annualFee}</span>
          </div>

          {/* Transportation Fees */}
          <div className="space-y-1 pt-1">
            <div className="font-bold underline decoration-1">Transportation Fees (Optional)</div>
            <div className="space-y-0.5 pl-2 sm:pl-3">
              <div className="flex justify-between items-center gap-2">
                <span>For day scholars (per Annum) – For Bhubaneswar</span>
                <span className="font-mono shrink-0">Rs. 25,000/-</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>For day scholars (per Annum) – For Khordha</span>
                <span className="font-mono shrink-0">Rs. 30,000/-</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>For day scholars (per Annum) – For Cuttack</span>
                <span className="font-mono shrink-0">Rs. 35,000/-</span>
              </div>
            </div>
          </div>

          {/* Hostel Fees */}
          <div className="space-y-1 pt-1">
            <div className="font-bold underline decoration-1">Hostel Fees (Optional) Per Year</div>
            <div className="space-y-0.5 pl-2 sm:pl-3">
              <div className="flex justify-between items-center gap-2">
                <span>Boarding Charges (A.C. Room – 2 Occupancy)</span>
                <span className="font-mono shrink-0">Rs. 1,25,000/-</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Boarding Charges (A.C. Room – 3 Occupancy)</span>
                <span className="font-mono shrink-0">Rs. 95,000/-</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Boarding Charges (A.C. Room – 4 Occupancy)</span>
                <span className="font-mono shrink-0">Rs. 85,000/-</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Boarding Charges (Non A.C. Room)</span>
                <span className="font-mono shrink-0">Rs. 55,000/-</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Caution Money (One Time and refundable)</span>
                <span className="font-mono shrink-0">Rs. 5,000/-</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Messing Charge – Extra (per year) Approx</span>
                <span className="font-mono shrink-0">Rs. 45,000/-</span>
              </div>
            </div>
          </div>

          {/* Subsequent Years Course Fee */}
          <div className="space-y-0.5 pt-1">
            <div className="font-bold underline decoration-1">Fees for:</div>
            <div className="space-y-0.5 pl-2 sm:pl-3">
              <div className="flex justify-between items-center font-semibold gap-2">
                <span>3<sup>rd</sup> Year Annual course fee</span>
                <span className="font-mono font-bold shrink-0">Rs. 2, 75,000/-</span>
              </div>
              <div className="flex justify-between items-center font-semibold gap-2">
                <span>4<sup>th</sup> Year Annual course fee</span>
                <span className="font-mono font-bold shrink-0">Rs. 2, 75,000/-</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Stamps & Dean Signature Section */}
        <div className="pt-4 sm:pt-6 pb-2 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 relative z-10">
          {/* Left Seal & Verification */}
          <div className="space-y-1.5 flex flex-col items-center sm:items-start text-center sm:text-left">
            {/* Round Institutional Rubber Stamp */}
            <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-full border-2 border-dashed border-[#1E40AF] p-1 flex items-center justify-center text-center text-[7px] sm:text-[8px] font-bold text-[#1E40AF] leading-tight rotate-[-8deg] shadow-2xs shrink-0">
              <div className="w-full h-full rounded-full border border-[#1E40AF] flex flex-col items-center justify-center p-1">
                <span>★ FACULTY OF ENGG. & TECH. ★</span>
                <span className="font-black text-[9px] sm:text-[10px] text-[#1E3A8A]">ITER</span>
                <span>BHUBANESWAR</span>
              </div>
            </div>
            {/* Signature Initials */}
            <div className="text-[10px] sm:text-[11px] font-mono text-[#374151] pt-0.5 italic">
              Verified by Section Officer<br />
              <span className="text-[9px] sm:text-[10px] text-[#6B7280]">Date: {issueDate}</span>
            </div>
          </div>

          {/* Right Dean Signature and Stamp */}
          <div className="text-center sm:text-right space-y-1">
            {/* Stylized Signature Graphic */}
            <div className="font-serif italic text-base sm:text-lg text-[#1E3A8A] font-bold sm:pr-4">
              P. K. Nanda
            </div>
            <div className="border-t border-[#1E3A8A] pt-1 text-center font-sans">
              <span className="text-xs font-black text-[#1E3A8A] uppercase tracking-wider block">
                DEAN
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#1E40AF] block leading-tight">
                Faculty of Engg. & Tech., ITER
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-[#1E40AF] block uppercase">
                SIKSHA &apos;O&apos; ANUSANDHAN
              </span>
              <span className="text-[7.5px] sm:text-[8px] text-[#4B5563] block">
                (Deemed to be University)
              </span>
            </div>
          </div>
        </div>

        {/* NB Payment Notice */}
        <div className="text-[10px] sm:text-[11px] font-bold text-[#111827] italic pt-1 border-t border-[#D1D5DB]">
          NB: All payment should be made in shape of DD in favour of SIKSHA &apos;O&apos; ANUSANDHAN
        </div>

        {/* 6. Official Footer Strip */}
        <div className="border-t-2 border-black pt-2 text-center text-[8.5px] sm:text-[9.5px] text-[#1F2937] leading-tight space-y-0.5 font-sans">
          <div className="font-bold uppercase tracking-wider text-[10px] sm:text-[11px] text-[#111827]">
            FACULTY OF ENGINEERING & TECHNOLOGY
          </div>
          <div className="font-semibold">Institute of Technical Education & Research</div>
          <div>Jagamohan Nagar, Khandagiri, Bhubaneswar-751030, Odisha, India</div>
          <div>Tel: 0674-2350181, 2351539, 2351777, Fax: 0674-2351880, 2351217 | <span className="font-bold text-[#15803D]">www.soa.ac.in</span></div>
        </div>
      </div>
    </div>
  );
};

export default OfficialBonafideCertificate;
