import { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  FileText,
  Filter,
  ChevronDown,
} from 'lucide-react';

type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'in-progress' | 'blocked';
type ViewMode = 'day' | 'week' | 'month' | 'list';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  endTime: string;
  reason: string;
  insuranceType: string;
  duration: number;
  status: AppointmentStatus;
  doctorId: string;
  date: string;
  phone: string;
  notes: string;
  hour: number;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  branch: string;
}

const DOCTORS: Doctor[] = [
  { id: '1', name: 'Dra. Ana Vargas',      specialty: 'Medicina General', branch: 'Sucursal Central' },
  { id: '2', name: 'Dr. Luis Mora',         specialty: 'Cardiología',      branch: 'Sucursal Norte'   },
  { id: '3', name: 'Dra. Carmen Solís',     specialty: 'Pediatría',        branch: 'Sucursal Central' },
  { id: '4', name: 'Dr. Roberto Jiménez',   specialty: 'Ortopedia',        branch: 'Sucursal Sur'     },
];

const SPECIALTIES = ['Todas', 'Medicina General', 'Cardiología', 'Pediatría', 'Ortopedia'];
const BRANCHES    = ['Todas', 'Sucursal Central', 'Sucursal Norte', 'Sucursal Sur'];

const TODAY      = '2026-06-06';
const WEEK_DAYS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const WEEK_DATES = ['2026-06-08', '2026-06-09', '2026-06-10', '2026-06-11', '2026-06-12'];
const HOURS      = Array.from({ length: 12 }, (_, i) => i + 7); // 07–18

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1',  patientName: 'María González',       time: '08:00', endTime: '08:30', reason: 'Control mensual',         insuranceType: 'CCSS',    duration: 30, status: 'confirmed',   doctorId: '1', date: '2026-06-08', phone: '8888-1234', notes: 'Paciente con historial de hipertensión. Revisar presión arterial.',    hour: 8  },
  { id: 'a2',  patientName: 'Carlos Rodríguez',     time: '09:00', endTime: '09:30', reason: 'Dolor de pecho',          insuranceType: 'INS',     duration: 30, status: 'in-progress', doctorId: '1', date: '2026-06-08', phone: '7777-5566', notes: 'Llegó con 10 min de anticipación. Sin alergias conocidas.',           hour: 9  },
  { id: 'a3',  patientName: 'Laura Méndez',          time: '10:00', endTime: '10:45', reason: 'Revisión postoperatoria', insuranceType: 'CCSS',    duration: 45, status: 'pending',     doctorId: '1', date: '2026-06-08', phone: '6666-9900', notes: 'Primera revisión post-cirugía. Solicitar que traiga radiografías.',    hour: 10 },
  { id: 'a4',  patientName: 'BLOQUEO – Almuerzo',   time: '12:00', endTime: '13:00', reason: 'Descanso',                insuranceType: '-',       duration: 60, status: 'blocked',     doctorId: '1', date: '2026-06-08', phone: '-',        notes: '-',                                                                   hour: 12 },
  { id: 'a5',  patientName: 'Roberto Arias',         time: '13:00', endTime: '13:30', reason: 'Seguimiento diabetes',   insuranceType: 'CCSS',    duration: 30, status: 'cancelled',   doctorId: '1', date: '2026-06-08', phone: '8833-4412', notes: 'Canceló por transporte. Reagendar para la próxima semana.',           hour: 13 },
  { id: 'a6',  patientName: 'Diana Castillo',        time: '14:00', endTime: '14:30', reason: 'Gripe y fiebre',          insuranceType: 'Privado', duration: 30, status: 'confirmed',   doctorId: '1', date: '2026-06-08', phone: '7001-2233', notes: 'Fiebre desde hace 3 días. Solicitar examen de sangre completo.',      hour: 14 },
  { id: 'a7',  patientName: 'Esteban Núñez',         time: '07:30', endTime: '08:00', reason: 'Chequeo anual',           insuranceType: 'CCSS',    duration: 30, status: 'confirmed',   doctorId: '1', date: '2026-06-09', phone: '8855-6677', notes: 'Chequeo rutinario anual. Sin condiciones previas reportadas.',        hour: 7  },
  { id: 'a8',  patientName: 'Sofía Herrera',         time: '10:00', endTime: '10:30', reason: 'Asma',                    insuranceType: 'INS',     duration: 30, status: 'pending',     doctorId: '1', date: '2026-06-09', phone: '6644-9988', notes: 'Crisis asmática recurrente. Recordar que traiga inhalador actual.',   hour: 10 },
  { id: 'a9',  patientName: 'BLOQUEO – Reunión',    time: '11:00', endTime: '12:00', reason: 'Reunión de equipo',       insuranceType: '-',       duration: 60, status: 'blocked',     doctorId: '1', date: '2026-06-10', phone: '-',        notes: '-',                                                                   hour: 11 },
  { id: 'a10', patientName: 'Jorge Salazar',          time: '14:00', endTime: '14:30', reason: 'Dolor lumbar',            insuranceType: 'Privado', duration: 30, status: 'confirmed',   doctorId: '1', date: '2026-06-10', phone: '7711-3344', notes: 'Dolor crónico de espalda baja. Lleva aproximadamente 2 semanas.',    hour: 14 },
  { id: 'a11', patientName: 'Andrea Vega',            time: '09:00', endTime: '09:30', reason: 'Embarazo – Control',     insuranceType: 'CCSS',    duration: 30, status: 'confirmed',   doctorId: '1', date: '2026-06-11', phone: '8899-0011', notes: 'Semana 28 de embarazo. Control rutinario. Sin complicaciones.',      hour: 9  },
  { id: 'a12', patientName: 'Manuel Rojas',           time: '15:00', endTime: '15:30', reason: 'Hipertensión',            insuranceType: 'CCSS',    duration: 30, status: 'in-progress', doctorId: '1', date: '2026-06-11', phone: '6677-1122', notes: 'Medicación nueva. Controlar presión arterial antes de consulta.',    hour: 15 },
  { id: 'a13', patientName: 'Valeria Torres',         time: '08:00', endTime: '08:45', reason: 'Tiroides',                insuranceType: 'INS',     duration: 45, status: 'confirmed',   doctorId: '1', date: '2026-06-12', phone: '7788-9900', notes: 'Resultados de laboratorio listos. Revisar niveles TSH.',             hour: 8  },
  { id: 'a14', patientName: 'BLOQUEO – Capacitación',time: '16:00', endTime: '17:00', reason: 'Capacitación interna',    insuranceType: '-',       duration: 60, status: 'blocked',     doctorId: '1', date: '2026-06-12', phone: '-',        notes: '-',                                                                   hour: 16 },
];

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; dot: string; badge: string }> = {
  'confirmed':   { label: 'Confirmada',              color: 'bg-green-50  border-l-green-500  text-green-900',  dot: 'bg-green-500',  badge: 'bg-green-100  text-green-700'  },
  'pending':     { label: 'Pendiente',               color: 'bg-yellow-50 border-l-yellow-500 text-yellow-900', dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700' },
  'cancelled':   { label: 'Cancelada',               color: 'bg-red-50    border-l-red-500    text-red-900',    dot: 'bg-red-500',    badge: 'bg-red-100    text-red-700'    },
  'in-progress': { label: 'En curso / En sala',      color: 'bg-blue-50   border-l-blue-500   text-blue-900',   dot: 'bg-blue-500',   badge: 'bg-blue-100   text-blue-700'   },
  'blocked':     { label: 'Bloqueado / Descanso',    color: 'bg-gray-100  border-l-gray-400   text-gray-600',   dot: 'bg-gray-400',   badge: 'bg-gray-200   text-gray-600'   },
};

// ─── Appointment block (shared across views) ──────────────────────────────────
function AppointmentBlock({
  appt, compact = false,
  onDragStart, onHover, onLeave,
}: {
  appt: Appointment; compact?: boolean;
  onDragStart?: (a: Appointment) => void;
  onHover?: (e: React.MouseEvent, a: Appointment) => void;
  onLeave?: () => void;
}) {
  const cfg = STATUS_CONFIG[appt.status];
  const draggable = appt.status !== 'blocked';
  return (
    <div
      draggable={draggable}
      onDragStart={draggable ? () => onDragStart?.(appt) : undefined}
      onMouseEnter={e => onHover?.(e, appt)}
      onMouseLeave={() => onLeave?.()}
      className={`border-l-4 rounded-r-lg px-2 py-1.5 select-none transition-opacity hover:opacity-90
        ${cfg.color}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
        ${compact ? 'text-xs' : 'text-sm'}
      `}
    >
      <div className={`font-semibold truncate ${compact ? 'text-xs' : 'text-sm'}`}>
        {appt.status === 'blocked' ? appt.reason : appt.patientName}
      </div>
      {compact ? (
        <div className="opacity-70 truncate text-xs">{appt.time}</div>
      ) : (
        <>
          <div className="text-xs opacity-70 mt-0.5">{appt.time} · {appt.duration} min</div>
          {appt.status !== 'blocked' && (
            <div className="text-xs opacity-70 truncate">{appt.reason}</div>
          )}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${cfg.badge}`}>
              {cfg.label}
            </span>
            {appt.insuranceType !== '-' && (
              <span className="text-xs opacity-60">{appt.insuranceType}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Day view ─────────────────────────────────────────────────────────────────
function DayView({ appointments, selectedDate, onDragStart, onDrop, onHover, onLeave }: {
  appointments: Appointment[]; selectedDate: string;
  onDragStart: (a: Appointment) => void;
  onDrop: (date: string, hour: number) => void;
  onHover: (e: React.MouseEvent, a: Appointment) => void;
  onLeave: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">{selectedDate}</span>
      </div>
      <div className="overflow-y-auto max-h-[600px]">
        {HOURS.map(hour => {
          const appts = appointments.filter(a => a.hour === hour);
          return (
            <div
              key={hour}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(selectedDate, hour)}
              className="flex border-b border-gray-100 last:border-0 min-h-[64px] hover:bg-gray-50/50 transition-colors"
            >
              <div className="w-16 flex-shrink-0 px-3 py-3 text-xs font-medium text-gray-400 border-r border-gray-100 bg-gray-50">
                {String(hour).padStart(2, '0')}:00
              </div>
              <div className="flex-1 px-3 py-2 space-y-1">
                {appts.map(appt => (
                  <AppointmentBlock
                    key={appt.id} appt={appt}
                    onDragStart={onDragStart} onHover={onHover} onLeave={onLeave}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Week view ────────────────────────────────────────────────────────────────
function WeekView({ weekAppts, onDragStart, onDrop, onHover, onLeave }: {
  weekAppts: (date: string) => Appointment[];
  onDragStart: (a: Appointment) => void;
  onDrop: (date: string, hour: number) => void;
  onHover: (e: React.MouseEvent, a: Appointment) => void;
  onLeave: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: '3.5rem repeat(5, 1fr)' }}>
        <div className="bg-gray-50 border-r border-gray-100" />
        {WEEK_DATES.map((date, i) => (
          <div
            key={date}
            className={`px-2 py-3 text-center border-r border-gray-100 last:border-0 ${date === TODAY ? 'bg-blue-50' : 'bg-gray-50'}`}
          >
            <div className="text-xs font-medium text-gray-500">{WEEK_DAYS[i]}</div>
            <div className={`text-sm font-bold mt-0.5 ${date === TODAY ? 'text-blue-600' : 'text-gray-800'}`}>
              {8 + i}
            </div>
          </div>
        ))}
      </div>
      {/* Grid */}
      <div className="overflow-y-auto max-h-[560px]">
        {HOURS.map(hour => (
          <div
            key={hour}
            className="grid border-b border-gray-100 last:border-0 min-h-[60px]"
            style={{ gridTemplateColumns: '3.5rem repeat(5, 1fr)' }}
          >
            <div className="px-2 py-2 text-xs font-medium text-gray-400 border-r border-gray-100 bg-gray-50">
              {String(hour).padStart(2, '0')}:00
            </div>
            {WEEK_DATES.map(date => {
              const appts = weekAppts(date).filter(a => a.hour === hour);
              return (
                <div
                  key={date}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => onDrop(date, hour)}
                  className="border-r border-gray-100 last:border-0 px-1 py-1 space-y-0.5 hover:bg-gray-50/50 transition-colors"
                >
                  {appts.map(appt => (
                    <AppointmentBlock
                      key={appt.id} appt={appt} compact
                      onDragStart={onDragStart} onHover={onHover} onLeave={onLeave}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Month view ───────────────────────────────────────────────────────────────
function MonthView({ appointments, onHover, onLeave }: {
  appointments: Appointment[];
  onHover: (e: React.MouseEvent, a: Appointment) => void;
  onLeave: () => void;
}) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  // June 2026 starts on Monday → 0 offset
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
          <div key={d} className="text-xs font-medium text-gray-500 text-center py-3 border-r border-gray-100 last:border-0">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map(day => {
          const dateStr = `2026-06-${String(day).padStart(2, '0')}`;
          const dayAppts = appointments.filter(a => a.date === dateStr);
          const isToday   = dateStr === TODAY;
          const col       = (day - 1) % 7; // 0=Mon … 6=Sun
          const isWeekend = col >= 5;
          return (
            <div
              key={day}
              className={`min-h-[88px] p-1.5 border-b border-r border-gray-100
                ${isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50/60' : 'bg-white'}
              `}
            >
              <div className={`text-xs font-bold mb-1 w-5 h-5 flex items-center justify-center rounded-full
                ${isToday ? 'bg-blue-600 text-white' : isWeekend ? 'text-gray-400' : 'text-gray-700'}
              `}>
                {day}
              </div>
              <div className="space-y-0.5">
                {dayAppts.slice(0, 2).map(appt => (
                  <div
                    key={appt.id}
                    onMouseEnter={e => onHover(e, appt)}
                    onMouseLeave={onLeave}
                    className={`text-xs px-1 py-0.5 rounded truncate cursor-default ${STATUS_CONFIG[appt.status].badge}`}
                  >
                    {appt.time} {appt.status === 'blocked' ? appt.reason : appt.patientName}
                  </div>
                ))}
                {dayAppts.length > 2 && (
                  <div className="text-xs text-blue-600 font-medium px-1">+{dayAppts.length - 2} más</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── List view ────────────────────────────────────────────────────────────────
function ListView({ appointments, onHover, onLeave }: {
  appointments: Appointment[];
  onHover: (e: React.MouseEvent, a: Appointment) => void;
  onLeave: () => void;
}) {
  const sorted  = [...appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const grouped = sorted.reduce<Record<string, Appointment[]>>((acc, appt) => {
    (acc[appt.date] ??= []).push(appt);
    return acc;
  }, {});

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">Bitácora de Citas</span>
      </div>
      <div className="overflow-y-auto max-h-[600px]">
        {Object.entries(grouped).map(([date, appts]) => (
          <div key={date}>
            <div className="sticky top-0 bg-blue-50 border-y border-blue-100 px-4 py-2 z-10">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">{date}</span>
            </div>
            {appts.map(appt => {
              const cfg = STATUS_CONFIG[appt.status];
              return (
                <div
                  key={appt.id}
                  onMouseEnter={e => onHover(e, appt)}
                  onMouseLeave={onLeave}
                  className="flex items-start gap-4 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Time column */}
                  <div className="flex flex-col items-center gap-1 w-14 flex-shrink-0 pt-0.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                    <span className="text-xs font-bold text-gray-900">{appt.time}</span>
                    <span className="text-xs text-gray-400">{appt.duration} min</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {appt.status === 'blocked' ? appt.reason : appt.patientName}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    {appt.status !== 'blocked' && (
                      <>
                        <div className="text-sm text-gray-600 mb-1">{appt.reason}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />{appt.insuranceType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{appt.time} – {appt.endTime}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div className="px-4 py-8 text-center text-sm text-gray-400">— Fin de la bitácora —</div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Agenda() {
  const [viewMode,          setViewMode]          = useState<ViewMode>('week');
  const [selectedDoctor,    setSelectedDoctor]    = useState('1');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');
  const [selectedBranch,    setSelectedBranch]    = useState('Todas');
  const [selectedDate,      setSelectedDate]      = useState('2026-06-08');
  const [dragSource,        setDragSource]        = useState<Appointment | null>(null);
  const [pendingDrop,       setPendingDrop]       = useState<{ appt: Appointment; date: string; hour: number } | null>(null);
  const [tooltip,           setTooltip]           = useState<{ appt: Appointment; x: number; y: number } | null>(null);

  const allAppts   = MOCK_APPOINTMENTS.filter(a => a.doctorId === selectedDoctor);
  const dayAppts   = allAppts.filter(a => a.date === selectedDate);
  const weekAppts  = (date: string) => allAppts.filter(a => a.date === date);

  const filteredDoctors    = DOCTORS.filter(d =>
    (selectedSpecialty === 'Todas' || d.specialty === selectedSpecialty) &&
    (selectedBranch    === 'Todas' || d.branch    === selectedBranch)
  );
  const selectedDoctorInfo = DOCTORS.find(d => d.id === selectedDoctor);

  // Period label shown in toolbar
  const periodLabel =
    viewMode === 'day'   ? selectedDate :
    viewMode === 'week'  ? 'Semana 8–12 Jun 2026' :
    viewMode === 'month' ? 'Junio 2026' :
                           'Todas las citas';

  // ── Drag & drop ──
  const handleDragStart = (appt: Appointment) => setDragSource(appt);

  const handleDrop = (date: string, hour: number) => {
    if (!dragSource || dragSource.status === 'blocked') return;
    setPendingDrop({ appt: dragSource, date, hour });
    setDragSource(null);
  };

  const confirmDrop  = () => setPendingDrop(null);
  const cancelDrop   = () => setPendingDrop(null);

  // ── Tooltip ──
  const handleHover = (e: React.MouseEvent, appt: Appointment) => {
    if (appt.status === 'blocked') return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ appt, x: rect.right + 10, y: rect.top });
  };
  const handleLeave = () => setTooltip(null);

  // ── Mini-calendar ──
  const calDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="app-page p-6 min-h-full" onClick={() => setTooltip(null)}>
      {/* ── Page header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">Agenda Médica</h1>
        <p className="text-gray-500">Consulta y gestión de citas por doctor</p>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Filter className="w-4 h-4" />
          Filtros:
        </div>

        {/* Doctor */}
        <div className="relative">
          <select
            value={selectedDoctor}
            onChange={e => setSelectedDoctor(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filteredDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Specialty */}
        <div className="relative">
          <select
            value={selectedSpecialty}
            onChange={e => setSelectedSpecialty(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Branch */}
        <div className="relative">
          <select
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {BRANCHES.map(b => <option key={b}>{b}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Active doctor chip */}
        {selectedDoctorInfo && (
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {selectedDoctorInfo.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('')}
            </div>
            <span className="font-medium">{selectedDoctorInfo.name}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">{selectedDoctorInfo.specialty}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">{selectedDoctorInfo.branch}</span>
          </div>
        )}
      </div>

      {/* ── Body: sidebar + calendar ── */}
      <div className="flex gap-4 items-start">

        {/* ── Left sidebar ── */}
        <div className="w-52 flex-shrink-0 space-y-4">

          {/* Mini-calendar */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <button className="p-1 rounded hover:bg-gray-100 text-gray-500">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-gray-800">Junio 2026</span>
              <button className="p-1 rounded hover:bg-gray-100 text-gray-500">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 text-center mb-1">
              {['D','L','M','X','J','V','S'].map(d => (
                <div key={d} className="text-xs text-gray-400 font-medium py-0.5">{d}</div>
              ))}
            </div>
            {/* Days grid — June 2026 starts on Monday (col index 1) */}
            <div className="grid grid-cols-7 text-center gap-y-0.5">
              {/* Blank for Sunday offset (June 1 = Monday → blank for first Sunday cell) */}
              <div />
              {calDays.map(day => {
                const dateStr   = `2026-06-${String(day).padStart(2, '0')}`;
                const hasAppts  = allAppts.some(a => a.date === dateStr);
                const isToday   = dateStr === TODAY;
                const inWeek    = WEEK_DATES.includes(dateStr);
                return (
                  <button
                    key={day}
                    onClick={() => { setSelectedDate(dateStr); setViewMode('day'); }}
                    className={`text-xs py-1 rounded-full leading-none transition-colors
                      ${isToday  ? 'bg-blue-600 text-white font-bold' : ''}
                      ${inWeek && !isToday ? 'bg-blue-50 text-blue-700 font-semibold' : ''}
                      ${!inWeek && !isToday ? 'text-gray-700 hover:bg-gray-100' : ''}
                    `}
                  >
                    {day}
                    {hasAppts && !isToday && (
                      <span className="block mx-auto w-1 h-1 rounded-full bg-blue-400 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color legend */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Leyenda</h3>
            <div className="space-y-2.5">
              {(Object.entries(STATUS_CONFIG) as [AppointmentStatus, (typeof STATUS_CONFIG)[AppointmentStatus]][]).map(
                ([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <span className="text-xs text-gray-600">{cfg.label}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* ── Main calendar panel ── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {/* View mode tabs */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              {([['day','D'],['week','S'],['month','M'],['list','L']] as [ViewMode, string][]).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors border-r border-gray-200 last:border-0
                    ${viewMode === mode ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Period navigation */}
            <button className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-semibold text-gray-900 min-w-[180px] text-center">
              {periodLabel}
            </span>
            <button className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>

            <button className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              Hoy
            </button>

            <div className="ml-auto text-xs text-gray-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-gray-300 rounded-sm" />
              Arrastra para mover citas
            </div>
          </div>

          {/* Views */}
          {viewMode === 'day'   && (
            <DayView
              appointments={dayAppts} selectedDate={selectedDate}
              onDragStart={handleDragStart} onDrop={handleDrop}
              onHover={handleHover} onLeave={handleLeave}
            />
          )}
          {viewMode === 'week'  && (
            <WeekView
              weekAppts={weekAppts}
              onDragStart={handleDragStart} onDrop={handleDrop}
              onHover={handleHover} onLeave={handleLeave}
            />
          )}
          {viewMode === 'month' && (
            <MonthView
              appointments={allAppts}
              onHover={handleHover} onLeave={handleLeave}
            />
          )}
          {viewMode === 'list'  && (
            <ListView
              appointments={allAppts}
              onHover={handleHover} onLeave={handleLeave}
            />
          )}
        </div>
      </div>

      {/* ── Tooltip ── */}
      {tooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white rounded-xl shadow-2xl p-3 w-64 pointer-events-none"
          style={{ top: tooltip.y, left: Math.min(tooltip.x, window.innerWidth - 272) }}
          onClick={e => e.stopPropagation()}
        >
          <div className="text-xs font-semibold text-gray-200 mb-2 truncate">{tooltip.appt.patientName}</div>
          <div className="flex items-center gap-2 mb-1.5">
            <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-100">{tooltip.appt.phone}</span>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-gray-300 leading-relaxed">{tooltip.appt.notes}</span>
          </div>
        </div>
      )}

      {/* ── Drag & drop confirmation modal ── */}
      {pendingDrop && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar cambio de horario</h3>
              <p className="text-sm text-gray-500 mb-1">
                ¿Mover la cita de <strong>{pendingDrop.appt.patientName}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Nuevo horario: <strong>{pendingDrop.date}</strong> a las{' '}
                <strong>{String(pendingDrop.hour).padStart(2, '0')}:00</strong>
              </p>
              <p className="text-xs text-green-600 font-medium mb-6">✓ Horario disponible</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={cancelDrop}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDrop}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
