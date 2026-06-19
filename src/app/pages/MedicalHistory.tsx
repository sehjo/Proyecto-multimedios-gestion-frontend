import { useState, useMemo } from 'react';
import { Search, Eye, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router';
import DataTable from '../components/DataTable';
import { MOCK_PATIENTS } from '../../api/mockData';

export default function MedicalHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return MOCK_PATIENTS.filter(
      (p) =>
        (p.name ?? '').toLowerCase().includes(lower) ||
        (p.lastname ?? '').toLowerCase().includes(lower) ||
        (p.nick ?? '').toLowerCase().includes(lower) ||
        String(p.id).includes(lower)
    );
  }, [searchTerm]);

  const columns = useMemo(
    () => [
      { header: 'ID', accessor: 'id' },
      { header: 'Nombre', accessor: 'name' },
      { header: 'Apellido', accessor: 'lastname' },
      { header: 'Apodo', accessor: 'nick' },
    ],
    []
  );

  const customActions = useMemo(
    () => [
      {
        icon: <Eye className="w-4 h-4" />,
        label: 'Ver historial',
        onClick: (patient: any) => navigate(`/medical-history/${patient.id}`),
        className: 'text-emerald-600 hover:bg-emerald-50',
      },
    ],
    [navigate]
  );

  return (
    <div className="app-page p-8">
      <div className="app-page-header flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Historial Médico</h1>
          <p className="text-gray-500">Consulta el historial médico completo de cada paciente</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="app-page-search relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o apodo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {filteredPatients.length === 0 && !searchTerm ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No hay pacientes registrados</p>
          <p className="text-gray-400 text-sm mt-1">Registra pacientes desde el módulo de Pacientes</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredPatients} customActions={customActions} />
      )}
    </div>
  );
}
