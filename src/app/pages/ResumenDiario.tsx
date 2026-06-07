import { useState, useMemo } from 'react';
import {
  AlertTriangle, CheckCircle, ChevronDown, X,
  FileText, Phone, Bell, User, ClipboardList,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AppointmentStatus = 'programada' | 'en_sala' | 'en_consulta' | 'atendida' | 'cancelada';
type EHRTab = 'datos' | 'historial' | 'medicamentos';

interface Alert { detail: string; }

interface Appointment {
  id: string;
  patientName: string;
  age: number;
  sex: 'M' | 'F';
  timeStart: string;
  timeEnd: string;
  reason: string;
  status: AppointmentStatus;
  alerts: Alert[];
  bloodType: string;
  phone: string;
  email: string;
  insurance: string;
  allergies: string[];
  conditions: string[];
  medications: { name: string; dose: string }[];
  visits: { date: string; reason: string; summary: string }[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<AppointmentStatus, { label: string; bg: string; text: string; lborder: string }> = {
  programada:  { label: 'Programada',        bg: 'bg-gray-100',  text: 'text-gray-700',  lborder: 'border-l-gray-300'  },
  en_sala:     { label: 'Paciente en Sala',  bg: 'bg-amber-100', text: 'text-amber-700', lborder: 'border-l-amber-400' },
  en_consulta: { label: 'En Consulta',       bg: 'bg-blue-100',  text: 'text-blue-700',  lborder: 'border-l-blue-500'  },
  atendida:    { label: 'Atendida',          bg: 'bg-green-100', text: 'text-green-700', lborder: 'border-l-green-500' },
  cancelada:   { label: 'Cancelada',         bg: 'bg-red-100',   text: 'text-red-700',   lborder: 'border-l-red-400'   },
};

const TRANSITIONS: Partial<Record<AppointmentStatus, AppointmentStatus[]>> = {
  programada:  ['en_sala', 'cancelada'],
  en_sala:     ['en_consulta', 'programada', 'cancelada'],
  en_consulta: ['atendida'],
  cancelada:   ['programada'],
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '1', patientName: 'Maria Gonzalez Ulate', age: 45, sex: 'F',
    timeStart: '07:00', timeEnd: '07:30', reason: 'Control de hipertension arterial',
    status: 'atendida', alerts: [],
    bloodType: 'O+', phone: '8888-1234', email: 'mgonzalez@mail.com',
    insurance: 'CCSS - Seguro Voluntario',
    allergies: [], conditions: ['Hipertension arterial'],
    medications: [
      { name: 'Atenolol',  dose: '50mg 1 vez/dia' },
      { name: 'Losartan',  dose: '50mg 1 vez/dia' },
    ],
    visits: [
      { date: '2026-03-06', reason: 'Control tension', summary: 'TA: 135/85. Ajuste dosis Losartan.' },
      { date: '2025-12-15', reason: 'Control tension', summary: 'TA: 145/90. Inicia Losartan 25mg.' },
    ],
  },
  {
    id: '2', patientName: 'Carlos Ulate Mora', age: 32, sex: 'M',
    timeStart: '07:30', timeEnd: '08:00', reason: 'Dolor lumbar cronico - seguimiento',
    status: 'atendida', alerts: [],
    bloodType: 'A+', phone: '7777-5566', email: 'culate@mail.com',
    insurance: 'CCSS - Asegurado',
    allergies: [], conditions: ['Lumbalgia cronica'],
    medications: [{ name: 'Ibuprofeno', dose: '400mg cada 8h SOS' }],
    visits: [
      { date: '2026-02-10', reason: 'Dolor lumbar', summary: 'RX sin lesiones. Fisioterapia indicada.' },
    ],
  },
  {
    id: '3', patientName: 'Rosa Mendez Salas', age: 67, sex: 'F',
    timeStart: '08:00', timeEnd: '08:45', reason: 'Control diabetes tipo 2 + revision HbA1c',
    status: 'en_consulta',
    alerts: [
      { detail: 'ALERGIA: Penicilina (reaccion anafilactica grave)' },
      { detail: 'ALERGIA: AINEs' },
    ],
    bloodType: 'B+', phone: '6666-9900', email: 'rmendez@mail.com',
    insurance: 'CCSS - Pension',
    allergies: ['Penicilina (anafilaxia)', 'AINEs'],
    conditions: ['Diabetes mellitus tipo 2', 'Insuficiencia renal leve', 'Hipertension arterial'],
    medications: [
      { name: 'Metformina',      dose: '850mg 2 veces/dia' },
      { name: 'Insulina glargina', dose: '20 UI nocturno'  },
      { name: 'Enalapril',       dose: '10mg 1 vez/dia'    },
    ],
    visits: [
      { date: '2026-03-06', reason: 'Control DM2', summary: 'HbA1c 7.8%. Ajuste insulina glargina 18 → 20 UI.' },
      { date: '2025-09-12', reason: 'Control DM2', summary: 'HbA1c 8.2%. Inicia insulina glargina.'             },
    ],
  },
  {
    id: '4', patientName: 'Luis Vargas Chacon', age: 28, sex: 'M',
    timeStart: '09:00', timeEnd: '09:30', reason: 'Revision general anual',
    status: 'en_sala', alerts: [],
    bloodType: 'AB-', phone: '8833-4412', email: 'lvargas@mail.com',
    insurance: 'CCSS - Asegurado',
    allergies: [], conditions: [],
    medications: [],
    visits: [
      { date: '2025-06-06', reason: 'Revision general', summary: 'Examen fisico sin alteraciones. Laboratorios normales.' },
    ],
  },
  {
    id: '5', patientName: 'Ana Campos Brenes', age: 52, sex: 'F',
    timeStart: '10:00', timeEnd: '10:30', reason: 'Seguimiento cardiopatia isquemica',
    status: 'programada',
    alerts: [{ detail: 'Cardiopatia isquemica - infarto previo nov 2024' }],
    bloodType: 'O-', phone: '6644-9988', email: 'acampos@mail.com',
    insurance: 'INS - Seguro Medico',
    allergies: ['Contraste yodado'],
    conditions: ['Cardiopatia isquemica', 'Angina estable', 'Dislipidemia'],
    medications: [
      { name: 'Aspirina',      dose: '100mg 1 vez/dia'  },
      { name: 'Atorvastatina', dose: '40mg nocturno'    },
      { name: 'Bisoprolol',    dose: '5mg 1 vez/dia'    },
      { name: 'Nitroglicerina',dose: 'SOS (angina)'     },
    ],
    visits: [
      { date: '2026-02-14', reason: 'Control cardiologia', summary: 'ECG estable. Continua tratamiento.'   },
      { date: '2024-11-03', reason: 'Post-infarto',        summary: 'Alta hospitalaria. Inicia Bisoprolol.' },
    ],
  },
  {
    id: '6', patientName: 'Jorge Brenes Arce', age: 40, sex: 'M',
    timeStart: '11:00', timeEnd: '11:30', reason: 'Migrana cronica - control y ajuste',
    status: 'programada', alerts: [],
    bloodType: 'A-', phone: '8899-0011', email: 'jbrenes@mail.com',
    insurance: 'CCSS - Asegurado',
    allergies: [], conditions: ['Migrana con aura'],
    medications: [
      { name: 'Topiramato',  dose: '50mg 2 veces/dia' },
      { name: 'Sumatriptan', dose: '50mg SOS'          },
    ],
    visits: [
      { date: '2026-01-20', reason: 'Control migrana', summary: '4 episodios/mes. Ajuste Topiramato 25 → 50mg.' },
    ],
  },
  {
    id: '7', patientName: 'Patricia Solis Vega', age: 29, sex: 'F',
    timeStart: '14:00', timeEnd: '14:45', reason: 'Control prenatal - semana 28',
    status: 'programada', alerts: [],
    bloodType: 'A+', phone: '7733-6655', email: 'psolis@mail.com',
    insurance: 'CCSS - Asegurada',
    allergies: [], conditions: ['Embarazo 28 semanas (G1P0)'],
    medications: [
      { name: 'Acido folico', dose: '5mg 1 vez/dia'  },
      { name: 'Hierro',       dose: '300mg 1 vez/dia' },
    ],
    visits: [
      { date: '2026-05-06', reason: 'Control prenatal S24', summary: 'Ecografia normal. Ganancia de peso adecuada.' },
    ],
  },
  {
    id: '8', patientName: 'Roberto Mora Jimenez', age: 58, sex: 'M',
    timeStart: '15:00', timeEnd: '16:00', reason: 'Dolor abdominal episodico - evaluacion',
    status: 'programada',
    alerts: [{ detail: 'ALERGIA: Aspirina y salicilatos' }],
    bloodType: 'B-', phone: '8811-2233', email: 'rmora@mail.com',
    insurance: 'CCSS - Asegurado',
    allergies: ['Aspirina', 'Salicilatos'],
    conditions: ['Colitis cronica', 'Reflujo gastroesofagico (ERGE)'],
    medications: [
      { name: 'Omeprazol',  dose: '20mg antes del desayuno' },
      { name: 'Loperamida', dose: '2mg SOS'                 },
    ],
    visits: [
      { date: '2026-04-15', reason: 'Dolor abdominal', summary: 'Colonoscopia pendiente. Continua Omeprazol.' },
    ],
  },
];

// ─── EHR Modal ────────────────────────────────────────────────────────────────

function EHRModal({ patient, onClose }: { patient: Appointment; onClose: () => void }) {
  const [tab, setTab] = useState<EHRTab>('datos');

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4 bg-gray-50 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{patient.patientName}</h2>
              <p className="text-sm text-gray-500">
                {patient.age} anos &bull; {patient.sex === 'F' ? 'Femenino' : 'Masculino'} &bull; Tipo {patient.bloodType}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:block text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-medium">
              Expediente activo en segundo plano
            </span>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 border-b border-gray-100 flex-shrink-0">
          {([
            ['datos',        'Datos Personales'],
            ['historial',    'Historial Clinico'],
            ['medicamentos', 'Medicamentos y Alergias'],
          ] as [EHRTab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg -mb-px border-b-2 transition-colors
                ${tab === key
                  ? 'border-blue-600 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">

          {tab === 'datos' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Aseguradora',    patient.insurance],
                  ['Tipo de sangre', patient.bloodType],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Telefono</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />{patient.phone}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Correo electronico</p>
                  <p className="text-sm font-semibold text-gray-900">{patient.email}</p>
                </div>
              </div>

              {patient.conditions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Condiciones cronicas</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.conditions.map(c => (
                      <span key={c} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {patient.conditions.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Sin condiciones cronicas registradas.
                </div>
              )}
            </div>
          )}

          {tab === 'historial' && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Visitas anteriores</p>
              {patient.visits.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Sin visitas previas registradas.</p>
              ) : (
                <div className="space-y-3">
                  {patient.visits.map((v, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-gray-900">{v.reason}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-3">{v.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{v.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'medicamentos' && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Medicamentos actuales</p>
                {patient.medications.length === 0 ? (
                  <p className="text-sm text-gray-400">Sin medicamentos registrados.</p>
                ) : (
                  <div className="space-y-2">
                    {patient.medications.map((m, i) => (
                      <div key={i}
                        className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                        <span className="text-sm font-semibold text-blue-900">{m.name}</span>
                        <span className="text-xs text-blue-700">{m.dose}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Alergias registradas</p>
                {patient.allergies.length === 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    Sin alergias registradas.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map(a => (
                      <span key={a}
                        className="flex items-center gap-1.5 text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-full font-medium">
                        <AlertTriangle className="w-3 h-3" />{a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResumenDiario() {
  const [appointments, setAppointments]       = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId]   = useState<string | null>(null);
  const [notification, setNotification]       = useState<string | null>(null);

  const selectedPatient = selectedPatientId
    ? (appointments.find(a => a.id === selectedPatientId) ?? null)
    : null;

  const stats = useMemo(() => ({
    total:     appointments.length,
    atendidas: appointments.filter(a => a.status === 'atendida').length,
    en_curso:  appointments.filter(a => a.status === 'en_consulta' || a.status === 'en_sala').length,
    pendientes: appointments.filter(a => a.status === 'programada').length,
  }), [appointments]);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  const updateStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    setOpenDropdownId(null);
    showNotif('Estado actualizado. Notificacion enviada a recepcion. Agenda global actualizada.');
  };

  return (
    <div className="app-page p-6 min-h-full" onClick={() => setOpenDropdownId(null)}>

      {/* Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-4 py-3 rounded-xl shadow-xl
          flex items-center gap-2 text-sm font-medium max-w-sm">
          <Bell className="w-4 h-4 flex-shrink-0" />
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">Resumen Diario de Citas</h1>
        <p className="text-gray-500">
          Dra. Ana Vargas &bull; Medicina General &bull; Sucursal Central &bull;
          Sabado 6 de junio, 2026 &bull; 08:15 hrs
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total citas</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-400 mt-1">Jornada de hoy</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Atendidas</p>
          <p className="text-3xl font-bold text-green-700">{stats.atendidas}</p>
          <p className="text-xs text-green-600 mt-1">
            {stats.total > 0 ? Math.round((stats.atendidas / stats.total) * 100) : 0}% completado
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">En curso</p>
          <p className="text-3xl font-bold text-blue-700">{stats.en_curso}</p>
          <p className="text-xs text-blue-600 mt-1">En sala o en consulta</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-gray-900">{stats.pendientes}</p>
          <p className="text-xs text-gray-400 mt-1">Por atender hoy</p>
        </div>
      </div>

      {/* Column headers */}
      <div className="hidden lg:flex items-center gap-3 px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <div className="w-20 flex-shrink-0">Horario</div>
        <div className="w-6 flex-shrink-0" />
        <div className="flex-1 min-w-0">Paciente</div>
        <div className="w-64 flex-shrink-0">Motivo</div>
        <div className="w-36 flex-shrink-0">Estado</div>
        <div className="w-40 flex-shrink-0" />
      </div>

      {/* Appointment list */}
      <div className="space-y-2">
        {appointments.map(appt => {
          const cfg = STATUS_CFG[appt.status];
          const transitions = TRANSITIONS[appt.status] ?? [];
          const isDone = appt.status === 'atendida' || appt.status === 'cancelada';

          return (
            <div
              key={appt.id}
              onClick={e => e.stopPropagation()}
              className={`
                bg-white border border-gray-200 rounded-xl border-l-4 ${cfg.lborder} shadow-sm transition-all
                ${isDone ? 'opacity-55' : ''}
                ${appt.status === 'en_consulta' ? 'ring-2 ring-blue-200 shadow-blue-50' : ''}
                ${appt.status === 'en_sala'     ? 'ring-1 ring-amber-200'               : ''}
              `}
            >
              <div className="flex items-center gap-3 px-4 py-3 flex-wrap lg:flex-nowrap">

                {/* Time */}
                <div className="w-20 flex-shrink-0 text-center">
                  <p className="text-sm font-bold text-gray-900">{appt.timeStart}</p>
                  <p className="text-xs text-gray-400">{appt.timeEnd}</p>
                </div>

                {/* Alert icon with tooltip */}
                <div className="w-6 flex-shrink-0 flex items-center justify-center">
                  {appt.alerts.length > 0 && (
                    <div className="relative group">
                      <AlertTriangle className="w-5 h-5 text-red-500 cursor-help" />
                      <div className="absolute left-7 top-0 z-20 hidden group-hover:block bg-gray-900 text-white
                        text-xs rounded-xl p-3 w-60 shadow-xl pointer-events-none">
                        <p className="font-semibold mb-1">Alertas medicas</p>
                        {appt.alerts.map((al, i) => (
                          <p key={i} className={`${i > 0 ? 'mt-1' : ''} leading-snug`}>{al.detail}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Patient info */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => setSelectedPatientId(appt.id)}
                    className="text-left block"
                  >
                    <p className="text-sm font-semibold text-gray-900 hover:text-blue-700 transition-colors truncate">
                      {appt.patientName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appt.age} anos &bull; {appt.sex === 'F' ? 'Femenino' : 'Masculino'}
                    </p>
                  </button>
                </div>

                {/* Reason (desktop) */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                  <p className="text-sm text-gray-500 truncate" title={appt.reason}>{appt.reason}</p>
                </div>

                {/* Status badge */}
                <div className="w-36 flex-shrink-0">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Ver EHR */}
                  <button
                    onClick={() => setSelectedPatientId(appt.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600
                      bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Ver EHR
                  </button>

                  {/* Status change dropdown */}
                  {transitions.length > 0 ? (
                    <div className="relative">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === appt.id ? null : appt.id);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-300
                          rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        Estado <ChevronDown className="w-3 h-3" />
                      </button>

                      {openDropdownId === appt.id && (
                        <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200
                          rounded-xl shadow-xl min-w-[190px] overflow-hidden">
                          <div className="px-3 py-2 border-b border-gray-100">
                            <p className="text-xs text-gray-400 font-medium">Cambiar a:</p>
                          </div>
                          {transitions.map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(appt.id, s)}
                              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors
                                hover:bg-gray-50 ${STATUS_CFG[s].text}`}
                            >
                              {STATUS_CFG[s].label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-[80px]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <ClipboardList className="w-3.5 h-3.5" />
          Flujo: Programada → Paciente en Sala → En Consulta → Atendida
        </div>
        <div className="flex items-center gap-1.5 text-red-500">
          <AlertTriangle className="w-3.5 h-3.5" />
          Icono rojo = alertas medicas criticas. Pasar el cursor para ver detalle.
        </div>
      </div>

      {/* EHR Modal */}
      {selectedPatient && (
        <EHRModal patient={selectedPatient} onClose={() => setSelectedPatientId(null)} />
      )}
    </div>
  );
}
