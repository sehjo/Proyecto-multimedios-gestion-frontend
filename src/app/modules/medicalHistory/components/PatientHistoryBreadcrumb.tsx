import { Link } from 'react-router';
import type { Patient } from '../types/medicalHistory.types';

interface PatientHistoryBreadcrumbProps {
  patient: Patient;
}

export default function PatientHistoryBreadcrumb({ patient }: PatientHistoryBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link to="/medical-history" className="hover:text-blue-600 transition-colors">
        Historial Médico
      </Link>
      <span>/</span>
      <span className="text-gray-900 font-medium">
        {patient.name} {patient.lastname}
      </span>
    </nav>
  );
}
