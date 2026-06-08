import { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { getPatients, getUsers, getAppointments, createAppointment } from '../../api/services';
import { toast } from 'sonner';

const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const totalMinutes = 420 + i * 30; // 07:00 to 16:00
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const m = (totalMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
});

const INITIAL_FORM = {
  patient_id: '',
  doctor_id: '',
  specialty: '',
  appointment_date: '',
  appointment_time: '',
  notes: '',
};

export default function Appointments() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      resetForm();
      setShowModal(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const [patientsData, usersData] = await Promise.all([
        getPatients().catch(() => ({ data: [] })),
        getUsers().catch(() => ({ data: [] })),
      ]);
      setPatients(patientsData.data || []);
      setDoctors(usersData.data || []);
    } catch {
      toast.error('Error al cargar los datos');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!formData.doctor_id || !formData.appointment_date) {
      setBookedSlots([]);
      return;
    }
    const doctorId = formData.doctor_id;
    const date = formData.appointment_date;

    setLoadingSlots(true);
    getAppointments({ doctor_id: doctorId, date })
      .catch(() => ({ data: [] }))
      .then((data: any) => {
        const booked = (data.data || []).map((a: any) => a.appointment_time?.substring(0, 5));
        setBookedSlots(booked);
        setFormData((prev) =>
          booked.includes(prev.appointment_time) ? { ...prev, appointment_time: '' } : prev
        );
      })
      .finally(() => setLoadingSlots(false));
  }, [formData.doctor_id, formData.appointment_date]);

  const availableSlots = useMemo(
    () => TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot)),
    [bookedSlots]
  );

  const handleDoctorChange = (doctorId: string) => {
    setFormData((prev) => ({ ...prev, doctor_id: doctorId, appointment_time: '' }));
  };

  const handleDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, appointment_date: date, appointment_time: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.appointment_time) {
      toast.error('Por favor seleccione un horario disponible');
      return;
    }
    try {
      await createAppointment({
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        specialty: formData.specialty,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        notes: formData.notes || undefined,
        status: 'pending',
      });
      toast.success('Cita agendada exitosamente');
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al agendar la cita';
      toast.error(message);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setBookedSlots([]);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="app-page p-8">
      <div className="app-page-header flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Citas</h1>
          <p className="text-gray-500">Agendamiento de citas médicas</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Cita
        </button>
      </div>

      {loadingData ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No hay citas registradas.</p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="mt-4 text-blue-600 text-sm font-medium hover:underline"
          >
            Agendar primera cita
          </button>
        </div>
      )}

      {showModal && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nueva Cita</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
                <SelectWrapper>
                  <select
                    required
                    value={formData.patient_id}
                    onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                    className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Seleccionar paciente...</option>
                    {patients.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.lastname}
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </SelectWrapper>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                <SelectWrapper>
                  <select
                    required
                    value={formData.doctor_id}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                    className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Seleccionar doctor...</option>
                    {doctors.map((d: any) => (
                      <option key={d.id} value={d.id}>
                        {d.name} {d.lastname}
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </SelectWrapper>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  placeholder="ej. Cardiología, Pediatría"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                <input
                  type="date"
                  required
                  min={today}
                  value={formData.appointment_date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora disponible *
                </label>
                {!formData.doctor_id || !formData.appointment_date ? (
                  <p className="text-sm text-gray-400 italic">
                    Seleccione un doctor y fecha para ver los horarios disponibles.
                  </p>
                ) : loadingSlots ? (
                  <p className="text-sm text-gray-400">Cargando horarios...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-orange-500">
                    No hay horarios disponibles para esta fecha.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, appointment_time: slot }))}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          formData.appointment_time === slot
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Observaciones adicionales..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="app-modal-actions flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formData.appointment_time}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>;
}

function ChevronDown() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  );
}
