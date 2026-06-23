import { useState } from 'react';
import { DOCTORS, MOCK_APPOINTMENTS } from '../constants';

export function useAgendaFilters() {
  const [selectedDoctor, setSelectedDoctor] = useState('1');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');
  const [selectedBranch, setSelectedBranch] = useState('Todas');

  const filteredDoctors = DOCTORS.filter(
    (d) =>
      (selectedSpecialty === 'Todas' || d.specialty === selectedSpecialty) &&
      (selectedBranch === 'Todas' || d.branch === selectedBranch)
  );
  const selectedDoctorInfo = DOCTORS.find((d) => d.id === selectedDoctor);
  const allAppts = MOCK_APPOINTMENTS.filter((a) => a.doctorId === selectedDoctor);

  return {
    selectedDoctor,
    setSelectedDoctor,
    selectedSpecialty,
    setSelectedSpecialty,
    selectedBranch,
    setSelectedBranch,
    filteredDoctors,
    selectedDoctorInfo,
    allAppts,
  };
}
