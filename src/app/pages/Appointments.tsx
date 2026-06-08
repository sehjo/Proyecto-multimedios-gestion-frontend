import { useState, useEffect, useMemo } from 'react';
import { Plus, Filter, X, AlertTriangle, XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import DataTable from '../components/DataTable';
import {
  MOCK_PATIENTS,
  MOCK_DOCTORS,
  MOCK_APPOINTMENTS,
  type AppointmentStatus,
} from '../../api/mockData';

// ─── Constants ────────────────────────────────────────────────────────────────

const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const totalMinutes = 420 + i * 30; // 07:00 to 16:00
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const m = (totalMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
});

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; classes: string }> = {
  pending:   { label: 'Pendiente',  classes: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmada', classes: 'bg-blue-100 text-blue-800'   },
  cancelled: { label: 'Cancelada',  classes: 'bg-red-100 text-red-800'     },
  attended:  { label: 'Atendida',   classes: 'bg-green-100 text-green-800' },
};

const INITIAL_FORM = {
  patient_id: '',
  doctor_id: '',
  specialty: '',
  appointment_date: '',
  appointment_time: '',
  notes: '',
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Appointment = {
  id: number;
  patient_id: number;
  doctor_id: number;
  specialty: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string;
  cancellation_reason?: string;
};

type EnrichedAppointment = Appointment & {
  patient_name: string;
  doctor_name: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, classes: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Appointments() {
  const location = useLocation();
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Filters
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Cancel modal
  const [appointmentToCancel, setAppointmentToCancel] = useState<EnrichedAppointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const hasActiveFilters = filterDoctor !== '' || filterDate !== '' || filterStatus !== '';

  // ── Effects ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      resetForm();
      setShowModal(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  useEffect(() => {
    if (!formData.doctor_id || !formData.appointment_date) {
      setBookedSlots([]);
      return;
    }
    const doctorId = parseInt(formData.doctor_id);
    const date = formData.appointment_date;
    const booked = appointments
      .filter((a) => a.doctor_id === doctorId && a.appointment_date === date && a.status !== 'cancelled')
      .map((a) => a.appointment_time.substring(0, 5));

    setBookedSlots(booked);
    setFormData((prev) =>
      booked.includes(prev.appointment_time) ? { ...prev, appointment_time: '' } : prev
    );
  }, [formData.doctor_id, formData.appointment_date, appointments]);

  // ── Derived data ─────────────────────────────────────────────────────────────

  const availableSlots = useMemo(
    () => TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot)),
    [bookedSlots]
  );

  const enrichedAppointments = useMemo<EnrichedAppointment[]>(
    () =>
      appointments.map((appt) => {
        const patient = MOCK_PATIENTS.find((p) => p.id === appt.patient_id);
        const doctor = MOCK_DOCTORS.find((d) => d.id === appt.doctor_id);
        return {
          ...appt,
          patient_name: patient ? `${patient.name} ${patient.lastname}` : '-',
          doctor_name: doctor ? `${doctor.name} ${doctor.lastname}` : '-',
        };
      }),
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    return enrichedAppointments.filter((appt) => {
      if (filterDoctor && String(appt.doctor_id) !== filterDoctor) return false;
      if (filterDate && appt.appointment_date !== filterDate) return false;
      if (filterStatus && appt.status !== filterStatus) return false;
      return true;
    });
  }, [enrichedAppointments, filterDoctor, filterDate, filterStatus]);

  const columns = useMemo(
    () => [
      { header: 'Paciente',     accessor: 'patient_name' },
      { header: 'Doctor',       accessor: 'doctor_name' },
      { header: 'Especialidad', accessor: 'specialty' },
      {
        header: 'Fecha',
        accessor: 'appointment_date',
        render: (value: string) => formatDate(value),
      },
      { header: 'Hora', accessor: 'appointment_time' },
      {
        header: 'Estado',
        accessor: 'status',
        render: (value: AppointmentStatus) => <StatusBadge status={value} />,
      },
    ],
    []
  );

  const customActions = useMemo(
    () => [
      {
        icon: <XCircle className="w-4 h-4" />,
        label: 'Cancelar cita',
        onClick: (row: EnrichedAppointment) => {
          if (row.status === 'attended') {
            toast.error('La cita ya fue atendida y no puede modificarse.');
            return;
          }
          if (row.status === 'cancelled') {
            toast.info('Esta cita ya está cancelada.');
            return;
          }
          setAppointmentToCancel(row);
          setCancelReason('');
        },
        className: 'text-red-500 hover:bg-red-50',
      },
    ],
    []
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleDoctorChange = (doctorId: string) => {
    const doctor = MOCK_DOCTORS.find((d) => String(d.id) === doctorId);
    setFormData((prev) => ({
      ...prev,
      doctor_id: doctorId,
      specialty: doctor?.specialty ?? '',
      appointment_time: '',
    }));
  };

  const handleDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, appointment_date: date, appointment_time: '' }));
  };

  const handleNewAppointmentSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!formData.appointment_time) {
      toast.error('Por favor seleccione un horario disponible');
      return;
    }
    const newAppointment: Appointment = {
      id: appointments.length + 1,
      patient_id: parseInt(formData.patient_id),
      doctor_id: parseInt(formData.doctor_id),
      specialty: formData.specialty,
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      status: 'pending',
      notes: formData.notes,
    };
    setAppointments((prev) => [...prev, newAppointment]);
    toast.success('Cita agendada exitosamente');
    setShowModal(false);
    resetForm();
  };

  const handleCancelConfirm = () => {
    if (!appointmentToCancel || !cancelReason.trim()) return;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentToCancel.id
          ? { ...a, status: 'cancelled', cancellation_reason: cancelReason.trim() }
          : a
      )
    );

    toast.success('Cita cancelada exitosamente');
    toast.info(`Notificación enviada a ${appointmentToCancel.patient_name} informando la cancelación.`);

    setAppointmentToCancel(null);
    setCancelReason('');
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setBookedSlots([]);
  };

  const clearFilters = () => {
    setFilterDoctor('');
    setFilterDate('');
    setFilterStatus('');
  };

  const today = new Date().toISOString().split('T')[0];

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="app-page p-8">

      {/* Header */}
      <div className="app-page-header flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Citas</h1>
          <p className="text-gray-500">Gestión de citas médicas</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Cita
        </button>
      </div>

      {/* Filter bar */}
      <div className="mb-5 bg-white rounded-xl border border-gray-200 px-4 py-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mr-1">
            <Filter className="w-4 h-4" />
            Filtros
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-gray-500 mb-1">Doctor</label>
            <SelectWrapper>
              <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="w-full appearance-none text-sm px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Todos</option>
                {MOCK_DOCTORS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.lastname}
                  </option>
                ))}
              </select>
              <ChevronDown />
            </SelectWrapper>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-gray-500 mb-1">Fecha</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-gray-500 mb-1">Estado</label>
            <SelectWrapper>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full appearance-none text-sm px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Todos</option>
                {(Object.keys(STATUS_CONFIG) as AppointmentStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
              <ChevronDown />
            </SelectWrapper>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <p className="mt-2 text-xs text-gray-400">
            {filteredAppointments.length} de {appointments.length} cita{appointments.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filteredAppointments} customActions={customActions} />

      {/* ── New Appointment Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nueva Cita</h2>
            <form onSubmit={handleNewAppointmentSubmit} className="space-y-4">
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
                    {MOCK_PATIENTS.map((p) => (
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
                    {MOCK_DOCTORS.map((d) => (
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
                  onClick={() => { setShowModal(false); resetForm(); }}
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

      {/* ── Cancel Confirmation Modal ─────────────────────────────────────────── */}
      {appointmentToCancel && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cancelar Cita</h3>
                <p className="text-sm text-gray-500">
                  Esta acción liberará el horario en la agenda del doctor.
                </p>
              </div>
            </div>

            {/* Appointment summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Paciente</span>
                <span className="font-medium text-gray-900">{appointmentToCancel.patient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Doctor</span>
                <span className="font-medium text-gray-900">{appointmentToCancel.doctor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Especialidad</span>
                <span className="font-medium text-gray-900">{appointmentToCancel.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha y hora</span>
                <span className="font-medium text-gray-900">
                  {formatDate(appointmentToCancel.appointment_date)} — {appointmentToCancel.appointment_time}
                </span>
              </div>
            </div>

            {/* Reason */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de cancelación *
              </label>
              <textarea
                rows={3}
                maxLength={500}
                placeholder="Indique el motivo de la cancelación..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                autoFocus
              />
              <p className="text-right text-xs text-gray-400 mt-1">{cancelReason.length}/500</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setAppointmentToCancel(null); setCancelReason(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                type="button"
                disabled={!cancelReason.trim()}
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
