interface UsersStatePlaceholderProps {
  title: string;
  subtitle?: string;
}

// Centered card used for the no-access and loading states of the users list.
export default function UsersStatePlaceholder({ title, subtitle }: UsersStatePlaceholderProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <p className="text-gray-700 font-medium">{title}</p>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
