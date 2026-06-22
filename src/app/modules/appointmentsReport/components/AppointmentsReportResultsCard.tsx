import { FileDown, FileSpreadsheet } from 'lucide-react';
import { STATUS_CONFIG } from '../constants';
import type { AppointmentRecord } from '../types/appointmentsReport.types';

const TABLE_COLUMNS = ['ID', 'Paciente', 'Doctor', 'Especialidad', 'Fecha', 'Hora', 'Estado'];

interface AppointmentsReportResultsCardProps {
  appointments: AppointmentRecord[];
}

export default function AppointmentsReportResultsCard({
  appointments,
}: AppointmentsReportResultsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Resultados</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {appointments.length} {appointments.length === 1 ? 'cita encontrada' : 'citas encontradas'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors">
            <FileDown className="w-4 h-4" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-green-200 hover:bg-green-50 text-green-700 text-sm font-medium rounded-lg transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appointments.map((appt) => {
              const statusCfg = STATUS_CONFIG[appt.status];
              return (
                <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{appt.id}</td>
                  <td className="px-5 py-4 font-medium text-gray-900">{appt.patient}</td>
                  <td className="px-5 py-4 text-gray-700">{appt.doctor}</td>
                  <td className="px-5 py-4 text-gray-600">{appt.specialty}</td>
                  <td className="px-5 py-4 text-gray-600">{appt.date}</td>
                  <td className="px-5 py-4 text-gray-600">{appt.time}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.classes}`}>
                      {statusCfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">
                  No se encontraron citas con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {appointments.map((appt) => {
          const statusCfg = STATUS_CONFIG[appt.status];
          return (
            <div key={appt.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 text-sm">{appt.patient}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusCfg.classes}`}>
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">{appt.doctor} — {appt.specialty}</p>
              <p className="text-xs text-gray-400">{appt.date} a las {appt.time}</p>
              <p className="font-mono text-xs text-gray-300">{appt.id}</p>
            </div>
          );
        })}
        {appointments.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-400">
            No se encontraron citas con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}
