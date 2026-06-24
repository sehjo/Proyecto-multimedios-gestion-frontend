import { ChevronDown, Filter } from 'lucide-react';
import { BRANCHES, SPECIALTIES } from '../constants';
import type { Doctor } from '../types/agenda.types';

interface AgendaFilterBarProps {
  filteredDoctors: Doctor[];
  selectedDoctor: string;
  onDoctorChange: (id: string) => void;
  selectedSpecialty: string;
  onSpecialtyChange: (specialty: string) => void;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  selectedDoctorInfo: Doctor | undefined;
}

export default function AgendaFilterBar({
  filteredDoctors,
  selectedDoctor,
  onDoctorChange,
  selectedSpecialty,
  onSpecialtyChange,
  selectedBranch,
  onBranchChange,
  selectedDoctorInfo,
}: AgendaFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
        <Filter className="w-4 h-4" />
        Filtros:
      </div>

      {/* Doctor */}
      <div className="relative">
        <select
          value={selectedDoctor}
          onChange={(e) => onDoctorChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {filteredDoctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {/* Specialty */}
      <div className="relative">
        <select
          value={selectedSpecialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {/* Branch */}
      <div className="relative">
        <select
          value={selectedBranch}
          onChange={(e) => onBranchChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {BRANCHES.map((b) => <option key={b}>{b}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {/* Active doctor chip */}
      {selectedDoctorInfo && (
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {selectedDoctorInfo.name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('')}
          </div>
          <span className="font-medium">{selectedDoctorInfo.name}</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-500">{selectedDoctorInfo.specialty}</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-500">{selectedDoctorInfo.branch}</span>
        </div>
      )}
    </div>
  );
}
