import { Stethoscope, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';
import type { DoctorOccupancyTotals } from '../types/doctorOccupancyReport.types';

interface Props {
  totals: DoctorOccupancyTotals;
  overallDailyAvg: string;
}

export default function DoctorOccupancyStatsGrid({ totals, overallDailyAvg }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Citas Asignadas</p>
            <p className="text-3xl font-bold text-gray-900">{totals.assigned}</p>
            <p className="text-xs text-gray-400 mt-1.5">Total en el período</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Citas Atendidas</p>
            <p className="text-3xl font-bold text-green-600">{totals.attended}</p>
            <p className="text-xs text-gray-400 mt-1.5">Consultas completadas</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Citas Canceladas</p>
            <p className="text-3xl font-bold text-red-500">{totals.cancelled}</p>
            <p className="text-xs text-gray-400 mt-1.5">No realizadas</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Promedio Diario</p>
            <p className="text-3xl font-bold text-orange-500">{overallDailyAvg}</p>
            <p className="text-xs text-gray-400 mt-1.5">Citas / día (promedio)</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
