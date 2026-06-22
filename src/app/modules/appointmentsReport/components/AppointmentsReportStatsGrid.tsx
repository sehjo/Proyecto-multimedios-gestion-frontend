import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface AppointmentsReportStatsGridProps {
  totalCount: number;
  attendedCount: number;
  cancelledCount: number;
  pendingCount: number;
}

function pct(count: number, total: number) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

export default function AppointmentsReportStatsGrid({
  totalCount,
  attendedCount,
  cancelledCount,
  pendingCount,
}: AppointmentsReportStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Citas</p>
            <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
            <p className="text-xs text-gray-400 mt-1.5">En el período seleccionado</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Atendidas</p>
            <p className="text-3xl font-bold text-green-600">{attendedCount}</p>
            <p className="text-xs text-gray-400 mt-1.5">{pct(attendedCount, totalCount)}% del total</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Canceladas</p>
            <p className="text-3xl font-bold text-red-500">{cancelledCount}</p>
            <p className="text-xs text-gray-400 mt-1.5">{pct(cancelledCount, totalCount)}% del total</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-gray-400 mt-1.5">{pct(pendingCount, totalCount)}% del total</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
