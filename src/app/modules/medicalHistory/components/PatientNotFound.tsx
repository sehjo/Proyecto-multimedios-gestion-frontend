import { useNavigate } from 'react-router';

export default function PatientNotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <p className="text-gray-500 font-medium">Paciente no encontrado</p>
      <button
        type="button"
        onClick={() => navigate('/medical-history')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Volver al historial
      </button>
    </div>
  );
}
