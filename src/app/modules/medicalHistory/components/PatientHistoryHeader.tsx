import { Plus } from 'lucide-react';
import type { Patient } from '../types/medicalHistory.types';

interface PatientHistoryHeaderProps {
  patient: Patient;
  onCreate: () => void;
}

export default function PatientHistoryHeader({ patient, onCreate }: PatientHistoryHeaderProps) {
  const initials = `${patient.name?.[0] || ''}${patient.lastname?.[0] || ''}`.toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-bold text-xl">{initials}</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {patient.name} {patient.lastname}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Apodo: <span className="font-medium text-gray-700">{patient.nick}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          Nuevo registro
        </button>
      </div>
    </div>
  );
}
