interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

// Page heading (title + optional subtitle) shared by the auth screens.
export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-gray-900 text-3xl font-semibold">{title}</h1>
      {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}
