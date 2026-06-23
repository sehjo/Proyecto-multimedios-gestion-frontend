interface DoctorsStatePlaceholderProps {
  title: string;
  subtitle?: string;
}

// Centered card used for the loading/empty states of the doctors list.
export default function DoctorsStatePlaceholder({ title, subtitle }: DoctorsStatePlaceholderProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <p className="text-gray-700 font-medium">{title}</p>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
