import { useState, useMemo, useEffect } from 'react';
import { Plus, Filter, X, AlertTriangle, XCircle, RefreshCw, CheckCircle, Info } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import DataTable from '../components/DataTable';
import {
  MOCK_PATIENTS,
  MOCK_DOCTORS,
  MOCK_APPOINTMENTS,
  type AppointmentStatus,
} from '../../api/mockData';
import { useHistory } from '../../context/HistoryContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const totalMinutes = 420 + i * 30; // 07:00 to 16:00
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const m = (totalMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
});

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; classes: string }> = {
  pending:     { label: 'Pendiente',    classes: 'bg-yellow-100 text-yellow-800'  },
  confirmed:   { label: 'Confirmada',   classes: 'bg-blue-100 text-blue-800'     },
  cancelled:   { label: 'Cancelada',    classes: 'bg-red-100 text-red-800'       },
  attended:    { label: 'Atendida',     classes: 'bg-green-100 text-green-800'   },
  rescheduled: { label: 'Reprogramada', classes: 'bg-purple-100 text-purple-800' },
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
  attended_at?: string;
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


function bookedSlotsForDoctor(
  appointments: Appointment[],
  doctorId: number,
  date: string,
  excludeId?: number
): string[] {
  return appointments
    .filter(
      (a) =>
        a.doctor_id === doctorId &&
        a.appointment_date === date &&
        a.status !== 'cancelled' &&
        a.status !== 'rescheduled' &&
        a.id !== excludeId
    )
    .map((a) => a.appointment_time.substring(0, 5));
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

function AppointmentSummary({ appt }: { appt: EnrichedAppointment }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2.5 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Paciente</span>
        <span className="font-medium text-gray-900">{appt.patient_name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Doctor</span>
        <span className="font-medium text-gray-900">{appt.doctor_name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Especialidad</span>
        <span className="font-medium text-gray-900">{appt.specialty}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Fecha y hora</span>
        <span className="font-medium text-gray-900">
          {formatDate(appt.appointment_date)} — {appt.appointment_time}
        </span>
      </div>
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

function TimeSlotGrid({
  slots,
  selected,
  onSelect,
}: {
  slots: string[];
  selected: string;
  onSelect: (slot: string) => void;
}) {
  if (slots.length === 0) {
    return <p className="text-sm text-orange-500">No hay horarios disponibles para esta fecha.</p>;
  }
  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          onClick={() => onSelect(slot)}
          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
            selected === slot
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Appointments() {
  const location = useLocation();
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  // New appointment form
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Filters
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Attend modal
  const [appointmentToAttend, setAppointmentToAttend] = useState<EnrichedAppointment | null>(null);
  const [attendDiagnosis, setAttendDiagnosis] = useState('');
  const [attendTreatment, setAttendTreatment] = useState('');
  const [attendObservations, setAttendObservations] = useState('');
  const [attendDiagnosisError, setAttendDiagnosisError] = useState('');

  // Cancel modal
  const [appointmentToCancel, setAppointmentToCancel] = useState<EnrichedAppointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Reschedule modal
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<EnrichedAppointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const hasActiveFilters = filterDoctor !== '' || filterDate !== '' || filterStatus !== '';

  // ── Effects ────────────────────────────────────────────────────────────────

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
    const booked = bookedSlotsForDoctor(
      appointments,
      parseInt(formData.doctor_id),
      formData.appointment_date
    );
    setBookedSlots(booked);
    setFormData((prev) =>
      booked.includes(prev.appointment_time) ? { ...prev, appointment_time: '' } : prev
    );
  }, [formData.doctor_id, formData.appointment_date, appointments]);

  useEffect(() => {
    setRescheduleTime('');
  }, [rescheduleDate]);

  // ── Derived data ───────────────────────────────────────────────────────────

  const availableSlots = useMemo(
    () => TIME_SLOTS.filter((s) => !bookedSlots.includes(s)),
    [bookedSlots]
  );

  const rescheduleAvailableSlots = useMemo(() => {
    if (!appointmentToReschedule || !rescheduleDate) return [];
    const booked = bookedSlotsForDoctor(
      appointments,
      appointmentToReschedule.doctor_id,
      rescheduleDate,
      appointmentToReschedule.id
    );

    const originalSlot = appointmentToReschedule.appointment_time.substring(0, 5);
    return TIME_SLOTS.filter((s) => {
      if (booked.includes(s)) return false;
      if (rescheduleDate === appointmentToReschedule.appointment_date && s === originalSlot) return false;
      return true;
    });
  }, [appointmentToReschedule, rescheduleDate, appointments]);

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

  const filteredAppointments = useMemo(
    () =>
      enrichedAppointments.filter((a) => {
        if (filterDoctor && String(a.doctor_id) !== filterDoctor) return false;
        if (filterDate && a.appointment_date !== filterDate) return false;
        if (filterStatus && a.status !== filterStatus) return false;
        return true;
      }),
    [enrichedAppointments, filterDoctor, filterDate, filterStatus]
  );

  const columns = useMemo(
    () => [
      { header: 'Paciente',     accessor: 'patient_name' },
      { header: 'Doctor',       accessor: 'doctor_name' },
      { header: 'Especialidad', accessor: 'specialty' },
      {
        header: 'Fecha',
        accessor: 'appointment_date',
        render: (v: string) => formatDate(v),
      },
      { header: 'Hora', accessor: 'appointment_time' },
      {
        header: 'Estado',
        accessor: 'status',
        render: (v: AppointmentStatus) => <StatusBadge status={v} />,
      },
    ],
    []
  );

  const customActions = useMemo(
    () => [
      {
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Marcar como atendida',
        onClick: (row: EnrichedAppointment) => {
          if (row.status === 'attended') {
            toast.info('Esta cita ya fue marcada como atendida.');
            return;
          }
          if (row.status === 'cancelled') {
            toast.error('No se puede atender una cita cancelada.');
            return;
          }
          if (row.status === 'rescheduled') {
            toast.error('Esta cita fue reprogramada. Atienda la nueva cita.');
            return;
          }
          setAttendDiagnosis('');
          setAttendTreatment('');
          setAttendObservations('');
          setAttendDiagnosisError('');
          setAppointmentToAttend(row);
        },
        className: 'text-green-600 hover:bg-green-50',
      },
      {
        icon: <RefreshCw className="w-4 h-4" />,
        label: 'Reprogramar cita',
        onClick: (row: EnrichedAppointment) => {
          if (row.status === 'attended') {
            toast.error('La cita ya fue atendida y no puede modificarse.');
            return;
          }
          if (row.status === 'cancelled') {
            toast.error('No se puede reprogramar una cita cancelada.');
            return;
          }
          if (row.status === 'rescheduled') {
            toast.info('Esta cita ya fue reprogramada.');
            return;
          }
          setAppointmentToReschedule(row);
          setRescheduleDate('');
          setRescheduleTime('');
        },
        className: 'text-indigo-500 hover:bg-indigo-50',
      },
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
          if (row.status === 'rescheduled') {
            toast.info('Esta cita ya fue reprogramada.');
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

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleDoctorChange = (doctorId: string) => {
    const doctor = MOCK_DOCTORS.find((d) => String(d.id) === doctorId);
    setFormData((prev) => ({
      ...prev,
      doctor_id: doctorId,
      specialty: doctor?.specialty ?? '',
      appointment_time: '',
    }));
  };

  const handleNewAppointmentSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!formData.appointment_time) {
      toast.error('Por favor seleccione un horario disponible');
      return;
    }
    const newAppt: Appointment = {
      id: appointments.length + 1,
      patient_id: parseInt(formData.patient_id),
      doctor_id: parseInt(formData.doctor_id),
      specialty: formData.specialty,
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      status: 'pending' as AppointmentStatus,
      notes: formData.notes,
    };
    setAppointments((prev) => [...prev, newAppt]);
    toast.success('Cita agendada exitosamente');
    setShowModal(false);
    resetForm();
  };

  const { linkAppointmentEntry } = useHistory();

  const handleAttendConfirm = () => {
    if (!appointmentToAttend) return;
    if (!attendDiagnosis.trim()) {
      setAttendDiagnosisError('El diagnóstico es obligatorio');
      return;
    }
    const now = new Date().toISOString();
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentToAttend.id
          ? { ...a, status: 'attended' as AppointmentStatus, attended_at: now }
          : a
      )
    );
    linkAppointmentEntry({
      id: 0,
      patient_id: appointmentToAttend.patient_id,
      consultation_date: now,
      doctor_id: appointmentToAttend.doctor_id,
      diagnosis: attendDiagnosis.trim(),
      disease_id: null,
      treatment: attendTreatment.trim(),
      observations: attendObservations.trim(),
      medications: [],
    });
    const patientId = appointmentToAttend.patient_id;
    const patientName = appointmentToAttend.patient_name;
    toast.success('Cita marcada como atendida y vinculada al historial médico', {
      description: `Se creó un registro de atención para ${patientName}.`,
      action: {
        label: 'Ver historial',
        onClick: () => navigate(`/medical-history/${patientId}`),
      },
    });
    setAttendDiagnosis('');
    setAttendTreatment('');
    setAttendObservations('');
    setAttendDiagnosisError('');
    setAppointmentToAttend(null);
  };

  const handleCancelConfirm = () => {
    if (!appointmentToCancel || !cancelReason.trim()) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentToCancel.id
          ? { ...a, status: 'cancelled' as AppointmentStatus, cancellation_reason: cancelReason.trim() }
          : a
      )
    );
    toast.success('Cita cancelada exitosamente');
    toast.info(`Notificación enviada a ${appointmentToCancel.patient_name} informando la cancelación.`);
    setAppointmentToCancel(null);
    setCancelReason('');
  };

  const handleRescheduleConfirm = () => {
    if (!appointmentToReschedule || !rescheduleDate || !rescheduleTime) return;
    const newAppt: Appointment = {
      id: appointments.length + 1,
      patient_id: appointmentToReschedule.patient_id,
      doctor_id: appointmentToReschedule.doctor_id,
      specialty: appointmentToReschedule.specialty,
      appointment_date: rescheduleDate,
      appointment_time: rescheduleTime,
      status: 'confirmed' as AppointmentStatus,
      notes: appointmentToReschedule.notes,
    };
    setAppointments((prev) =>
      prev
        .map((a) =>
          a.id === appointmentToReschedule.id ? { ...a, status: 'rescheduled' as AppointmentStatus } : a
        )
        .concat(newAppt)
    );
    toast.success('Cita reprogramada exitosamente');
    toast.info(
      `Notificación enviada a ${appointmentToReschedule.patient_name} con la nueva fecha: ${formatDate(rescheduleDate)} a las ${rescheduleTime}.`
    );
    setAppointmentToReschedule(null);
    setRescheduleDate('');
    setRescheduleTime('');
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

  // ── Render ────────────────────────────────────────────────────────────────

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
                  <option key={d.id} value={d.id}>{d.name} {d.lastname}</option>
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

      {/* ── Attend Modal with Medical Record Form ──────────────────────────── */}
      {appointmentToAttend && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 pb-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Registrar Atención</h3>
                  <p className="text-sm text-gray-500">
                    Complete el registro médico para vincular esta cita al historial del paciente.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <AppointmentSummary appt={appointmentToAttend} />

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Registro de la atención
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diagnóstico <span className="text-red-500">*</span>
                      <span className="text-gray-400 font-normal ml-1">(máx. 500 caracteres)</span>
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      placeholder="Describa el diagnóstico de la consulta..."
                      value={attendDiagnosis}
                      onChange={(e) => {
                        setAttendDiagnosis(e.target.value);
                        if (e.target.value.trim()) setAttendDiagnosisError('');
                      }}
                      autoFocus
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm ${
                        attendDiagnosisError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <div className="flex justify-between mt-1">
                      {attendDiagnosisError
                        ? <p className="text-red-500 text-xs">{attendDiagnosisError}</p>
                        : <span />
                      }
                      <span className={`text-xs ${attendDiagnosis.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                        {attendDiagnosis.length}/500
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tratamiento indicado
                      <span className="text-gray-400 font-normal ml-1">(opcional, máx. 500 caracteres)</span>
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      placeholder="Describa el tratamiento indicado al paciente..."
                      value={attendTreatment}
                      onChange={(e) => setAttendTreatment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                    />
                    <p className="text-right text-xs text-gray-400 mt-0.5">{attendTreatment.length}/500</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                      <span className="text-gray-400 font-normal ml-1">(opcional, máx. 1000 caracteres)</span>
                    </label>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      placeholder="Observaciones adicionales de la consulta..."
                      value={attendObservations}
                      onChange={(e) => setAttendObservations(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                    />
                    <p className="text-right text-xs text-gray-400 mt-0.5">{attendObservations.length}/1000</p>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Los medicamentos indicados pueden agregarse desde el{' '}
                      <span className="font-medium">historial del paciente</span> después de guardar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAttendDiagnosis('');
                    setAttendTreatment('');
                    setAttendObservations('');
                    setAttendDiagnosisError('');
                    setAppointmentToAttend(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAttendConfirm}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Confirmar y vincular al historial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── New Appointment Modal ───────────────────────────────────────────── */}
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
                      <option key={p.id} value={p.id}>{p.name} {p.lastname}</option>
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
                      <option key={d.id} value={d.id}>{d.name} {d.lastname}</option>
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
                  onChange={(e) =>
                    setFormData({ ...formData, appointment_date: e.target.value, appointment_time: '' })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora disponible *</label>
                {!formData.doctor_id || !formData.appointment_date ? (
                  <p className="text-sm text-gray-400 italic">
                    Seleccione un doctor y fecha para ver los horarios disponibles.
                  </p>
                ) : (
                  <TimeSlotGrid
                    slots={availableSlots}
                    selected={formData.appointment_time}
                    onSelect={(slot) => setFormData((prev) => ({ ...prev, appointment_time: slot }))}
                  />
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

      {/* ── Reschedule Modal ────────────────────────────────────────────────── */}
      {appointmentToReschedule && (
        <div className="app-modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="app-modal-panel bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RefreshCw className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Reprogramar Cita</h3>
                <p className="text-sm text-gray-500">
                  La cita original quedará en el historial como reprogramada.
                </p>
              </div>
            </div>

            <div className="mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Cita actual</div>
            <AppointmentSummary appt={appointmentToReschedule} />

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva fecha *</label>
                <input
                  type="date"
                  required
                  min={today}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo horario disponible *</label>
                {!rescheduleDate ? (
                  <p className="text-sm text-gray-400 italic">
                    Seleccione una fecha para ver los horarios disponibles.
                  </p>
                ) : (
                  <TimeSlotGrid
                    slots={rescheduleAvailableSlots}
                    selected={rescheduleTime}
                    onSelect={setRescheduleTime}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setAppointmentToReschedule(null);
                  setRescheduleDate('');
                  setRescheduleTime('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                type="button"
                disabled={!rescheduleDate || !rescheduleTime}
                onClick={handleRescheduleConfirm}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar reprogramación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Confirmation Modal ───────────────────────────────────────── */}
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

            <AppointmentSummary appt={appointmentToCancel} />

            <div className="mt-5 mb-5">
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
