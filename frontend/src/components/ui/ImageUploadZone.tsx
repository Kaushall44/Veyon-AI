import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface ImageUploadZoneProps {
  onImageSelected: (dataUrl: string) => void;
  onImageRemoved: () => void;
  currentImage?: string;
  label?: string;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImageSelected,
  onImageRemoved,
  currentImage,
  label = 'Upload Item Picture'
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    setFileName('');
    setFileSize('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onImageRemoved();
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#1F1E1B]">
        {label}
      </label>

      {previewUrl ? (
        <div className="relative rounded-2xl border border-[#EAE7DF] bg-[#FAF8F3] p-2.5 flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-white border border-[#EAE7DF] overflow-hidden shrink-0">
            <img src={previewUrl} alt="Upload preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#1F1E1B] truncate">{fileName || 'Uploaded Photo'}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <p className="text-[11px] text-[#6C685C]">{fileSize || 'Image ready for listing'}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg bg-white border border-[#EAE7DF] text-[#8C887B] hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-600 bg-emerald-50/50 scale-[0.99]'
              : 'border-[#EAE7DF] bg-[#FAF8F3]/60 hover:bg-[#FAF8F3] hover:border-[#152E22]/30'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleChange}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-[#1F1E1B]">
            Click to upload or drag and drop image
          </p>
          <p className="text-[10px] text-[#8C887B] mt-0.5">
            PNG, JPG, or WEBP up to 5MB (from your computer or mobile camera)
          </p>
        </div>
      )}
    </div>
  );
};
