import { Stethoscope } from 'lucide-react';

export default function PatientsEmptyState() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 font-medium">No hay pacientes registrados</p>
      <p className="text-gray-400 text-sm mt-1">Registra pacientes desde el módulo de Pacientes</p>
    </div>
  );
}
