import { CheckCircle2, Info, X } from 'lucide-react';
import type { Banner } from '../types/doctors.types';

interface DoctorsBannerProps {
  banner: Banner | null;
  onDismiss: () => void;
}

// Inline result banner above the search bar (green = success, blue = info).
export default function DoctorsBanner({ banner, onDismiss }: DoctorsBannerProps) {
  if (!banner) return null;

  const isSuccess = banner.type === 'success';

  return (
    <div
      className={`mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-lg border ${
        isSuccess
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-blue-200 bg-blue-50 text-blue-700'
      }`}
    >
      <div className="flex items-center gap-2">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        ) : (
          <Info className="w-5 h-5 flex-shrink-0" />
        )}
        <span className="text-sm font-medium">{banner.msg}</span>
      </div>
      <button
        onClick={onDismiss}
        className={`transition-colors cursor-pointer ${
          isSuccess ? 'text-green-500 hover:text-green-700' : 'text-blue-500 hover:text-blue-700'
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
