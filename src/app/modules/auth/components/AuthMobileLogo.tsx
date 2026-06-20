import { ClipboardList } from 'lucide-react';

// Brand logo shown only on small screens (the branding panel is hidden there).
export default function AuthMobileLogo() {
  return (
    <div className="flex items-center gap-2 mb-10 lg:hidden">
      <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
        <ClipboardList className="w-5 h-5 text-white" />
      </div>
      <span className="text-gray-900 text-lg font-semibold">CCSS Consultory</span>
    </div>
  );
}
