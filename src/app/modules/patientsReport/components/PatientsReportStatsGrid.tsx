import { Users, UserPlus, UserCheck, CalendarDays } from 'lucide-react';
import type { ReportTotals } from '../types/patientsReport.types';

interface PatientsReportStatsGridProps {
  totals: ReportTotals;
}

export default function PatientsReportStatsGrid({ totals }: PatientsReportStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pacientes Atendidos</p>
            <p className="text-3xl font-bold text-gray-900">{totals.uniquePatients}</p>
            <p className="text-xs text-gray-400 mt-1.5">Pacientes únicos</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pacientes Nuevos</p>
            <p className="text-3xl font-bold text-green-600">{totals.newPatients}</p>
            <p className="text-xs text-gray-400 mt-1.5">Primera cita en el período</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <UserPlus className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pacientes Recurrentes</p>
            <p className="text-3xl font-bold text-purple-600">{totals.recurringPatients}</p>
            <p className="text-xs text-gray-400 mt-1.5">Con historial previo</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Consultas</p>
            <p className="text-3xl font-bold text-orange-500">{totals.consultations}</p>
            <p className="text-xs text-gray-400 mt-1.5">Incluyendo repetidas</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
