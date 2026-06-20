interface AuthSectionHeadingProps {
  title: string;
  subtitle: string;
}

// Centered heading (title + subtitle) used inside the reset card steps.
export default function AuthSectionHeading({ title, subtitle }: AuthSectionHeadingProps) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}
