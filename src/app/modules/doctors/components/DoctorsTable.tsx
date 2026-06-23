import { Loader2 } from 'lucide-react';
import editIcon from '@/assets/edit.svg';
import deleteIcon from '@/assets/delete.svg';
import type { Doctor, Speciality } from '../types/doctors.types';

interface DoctorsTableProps {
  doctors: Doctor[];
  loading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

const specialityLabel = (specialities?: Speciality[]): string =>
  Array.isArray(specialities) && specialities.length
    ? specialities.map((s) => s.name).join(', ')
    : '—';

// Doctors list table: per-row edit/delete actions, specialities shown as a
// comma-separated list (pivot doctor_specialities, expanded on the backend).
export default function DoctorsTable({ doctors, loading, onEdit, onDelete }: DoctorsTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center gap-3 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="responsive-data-table bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['ID', 'Identificación', 'Nombre', 'Email', 'Especialidades', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                  No hay doctores disponibles
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-500">{doctor.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-900">{doctor.identifier}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{doctor.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 break-all">{doctor.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 break-all">
                    {specialityLabel(doctor.specialities)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(doctor)}
                        title="Editar"
                        className="cursor-pointer transition-opacity hover:opacity-80"
                      >
                        <img src={editIcon} alt="Editar" className="w-9 h-9" />
                      </button>
                      <button
                        onClick={() => onDelete(doctor)}
                        title="Eliminar"
                        className="cursor-pointer transition-opacity hover:opacity-80"
                      >
                        <img src={deleteIcon} alt="Eliminar" className="w-9 h-9" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
