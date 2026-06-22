import { Info } from 'lucide-react';

export default function PatientsReportInfoBanner() {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg mb-6 text-sm text-blue-700">
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>
        Un paciente que tuvo múltiples consultas con el mismo médico cuenta como{' '}
        <strong>1 paciente único</strong>. Se considera <strong>nuevo</strong> si su primera
        cita registrada cae dentro del rango seleccionado.
      </span>
    </div>
  );
}
