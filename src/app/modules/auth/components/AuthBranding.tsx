import { ClipboardList } from 'lucide-react';

interface AuthBrandingProps {
  pills?: string[];
}

const DEFAULT_PILLS = ['Pacientes', 'Diagnósticos', 'Medicamentos', 'Enfermedades', 'Usuarios'];

// Presentational left panel shared by the auth pages: logo, headline, blurb and
// feature pills. Pure component — no state.
export default function AuthBranding({ pills = DEFAULT_PILLS }: AuthBrandingProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 flex-col justify-between p-12">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <span className="text-white text-xl font-semibold tracking-tight">CCSS Consultory</span>
      </div>

      {/* Center content */}
      <div className="space-y-6">
        <div className="w-16 h-1 bg-white/40 rounded-full" />
        <h2 className="text-white text-4xl font-light leading-snug">
          Sistema de gestión<br />
          <span className="font-semibold">médica integral</span>
        </h2>
        <p className="text-blue-100 text-base leading-relaxed max-w-sm">
          Administre pacientes, diagnósticos, tratamientos y más desde un único panel centralizado.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-3">
        {pills.map((item) => (
          <span
            key={item}
            className="px-4 py-2 rounded-full bg-white/10 text-white text-sm border border-white/20"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
