import { useState } from 'react';
import {
  CalendarX, AlertTriangle, CheckCircle, X, ChevronDown,
  Info, Bell, Phone, ClipboardList, Repeat, Ban, Users,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabKey = 'periodo' | 'institucional';

interface BlockedPeriod {
  id: string;
  doctorIds: string[];
  branch: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  justType: string;
  description: string;
  isInstitutional: boolean;
  isRecurring: boolean;
  affectedCount: number;
}

interface MockAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  doctorId: string;
  phone: string;
}

interface PeriodForm {
  selectedDoctors: string[];
  branch: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  justType: string;
  description: string;
}

interface InstForm {
  eventName: string;
  date: string;
  isRecurring: boolean;
  selectedDoctors: string[];
  justType: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DOCTORS = [
  { id: '1', name: 'Dra. Ana Vargas',    specialty: 'Medicina General' },
  { id: '2', name: 'Dr. Luis Mora',       specialty: 'Cardiologia'     },
  { id: '3', name: 'Dra. Carmen Solis',   specialty: 'Pediatria'       },
  { id: '4', name: 'Dr. Roberto Jimenez', specialty: 'Ortopedia'       },
];

const BRANCHES     = ['Sucursal Central', 'Sucursal Norte', 'Sucursal Sur'];
const JUSTIF_TYPES = ['Vacaciones', 'Congreso', 'Incapacidad', 'Feriado Nacional', 'Evento Institucional', 'Otro'];

const MOCK_APPOINTMENTS: MockAppointment[] = [
  { id: 'ap1', patientName: 'Maria Gonzalez',   date: '2026-06-20', time: '08:00', doctorId: '1', phone: '8888-1234' },
  { id: 'ap2', patientName: 'Carlos Rodriguez', date: '2026-06-21', time: '09:00', doctorId: '1', phone: '7777-5566' },
  { id: 'ap3', patientName: 'Laura Mendez',     date: '2026-06-22', time: '10:30', doctorId: '1', phone: '6666-9900' },
  { id: 'ap4', patientName: 'Roberto Arias',    date: '2026-06-20', time: '13:30', doctorId: '1', phone: '8833-4412' },
  { id: 'ap5', patientName: 'Sofia Herrera',    date: '2026-07-01', time: '10:00', doctorId: '2', phone: '6644-9988' },
  { id: 'ap6', patientName: 'Andrea Vega',      date: '2026-07-02', time: '09:00', doctorId: '2', phone: '8899-0011' },
];

const INITIAL_BLOCKS: BlockedPeriod[] = [
  {
    id: 'bp1', doctorIds: ['1'], branch: 'Sucursal Central',
    dateFrom: '2026-06-20', dateTo: '2026-06-25', timeFrom: '00:00', timeTo: '23:59',
    justType: 'Vacaciones', description: 'Vacaciones anuales aprobadas por RR.HH.',
    isInstitutional: false, isRecurring: false, affectedCount: 4,
  },
  {
    id: 'bp2', doctorIds: ['2'], branch: 'Sucursal Norte',
    dateFrom: '2026-07-01', dateTo: '2026-07-03', timeFrom: '08:00', timeTo: '17:00',
    justType: 'Congreso', description: 'Congreso Nacional de Cardiologia - San Jose',
    isInstitutional: false, isRecurring: false, affectedCount: 2,
  },
  {
    id: 'bp3', doctorIds: ['1', '2', '3', '4'], branch: 'Todas',
    dateFrom: '2026-09-15', dateTo: '2026-09-15', timeFrom: '00:00', timeTo: '23:59',
    justType: 'Feriado Nacional', description: 'Dia de la Independencia',
    isInstitutional: true, isRecurring: true, affectedCount: 0,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findConflicts(dateFrom: string, dateTo: string, doctorIds: string[]): MockAppointment[] {
  return MOCK_APPOINTMENTS.filter(a =>
    doctorIds.includes(a.doctorId) && a.date >= dateFrom && a.date <= dateTo,
  );
}

function getDoctorName(id: string): string {
  return DOCTORS.find(d => d.id === id)?.name ?? id;
}

function daysBetween(from: string, to: string): number {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000) + 1);
}

const STRIPE_STYLE = {
  background: 'repeating-linear-gradient(135deg, #f9fafb 0px, #f9fafb 8px, #f3f4f6 8px, #f3f4f6 16px)',
};
const STRIPE_INST_STYLE = {
  background: 'repeating-linear-gradient(135deg, #f5f3ff 0px, #f5f3ff 8px, #ede9fe 8px, #ede9fe 16px)',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConflictModal({ appointments, onCancel, onConfirm }: {
  appointments: MockAppointment[];
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Conflicto detectado</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {appointments.length} cita{appointments.length !== 1 ? 's' : ''} programada{appointments.length !== 1 ? 's' : ''} en el periodo seleccionado
            </p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800 flex gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Al confirmar, estas citas cambiaran a estado <strong>Reprogramacion Prioritaria</strong> y
            se generara una lista de tareas para que recepcion contacte a los pacientes.
            Se enviaran notificaciones automaticas a todos los involucrados.
          </span>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Citas afectadas</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {appointments.map((a, i) => (
              <div
                key={a.id}
                className={`flex items-center justify-between px-3 py-2.5 text-sm
                  ${i < appointments.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div>
                  <span className="font-medium text-gray-900">{a.patientName}</span>
                  <span className="text-gray-400 mx-2">-</span>
                  <span className="text-gray-600">{a.date} a las {a.time}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="w-3 h-3" />{a.phone}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 flex gap-2 text-sm text-blue-800">
          <Bell className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Se generara automaticamente una tarea de seguimiento por cada cita afectada.
            Los pacientes seran notificados via SMS y correo electronico.
            El portal de reservas bloqueara el rango de inmediato.
          </span>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm">
            Confirmar y Mover Citas
          </button>
        </div>
      </div>
    </div>
  );
}

function InstConflictModal({ doctorConflicts, onClose, onConfirm }: {
  doctorConflicts: { doctor: string; count: number }[];
  onClose: () => void;
  onConfirm: () => void;
}) {
  const total = doctorConflicts.reduce((s, d) => s + d.count, 0);
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Ban className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Conflictos globales detectados</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {total} cita{total !== 1 ? 's' : ''} afectada{total !== 1 ? 's' : ''} en {doctorConflicts.length} doctor{doctorConflicts.length !== 1 ? 'es' : ''}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          {doctorConflicts.map((dc, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2.5 text-sm
                ${i < doctorConflicts.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="font-medium text-gray-900">{dc.doctor}</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                {dc.count} cita{dc.count !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 flex gap-2 text-sm text-amber-800">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Todas las citas pasaran a <strong>Reprogramacion Prioritaria</strong> y se notificara a
            los administradores y pacientes sobre cada conflicto resuelto.
          </span>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
            Aplicar Bloqueo Global
          </button>
        </div>
      </div>
    </div>
  );
}

function BlockedPeriodCard({ block, onDelete }: { block: BlockedPeriod; onDelete: (id: string) => void }) {
  const days    = daysBetween(block.dateFrom, block.dateTo);
  const doctors = block.doctorIds.map(getDoctorName).join(', ');
  const allDay  = block.timeFrom === '00:00' && block.timeTo === '23:59';

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" style={block.isInstitutional ? STRIPE_INST_STYLE : STRIPE_STYLE}>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">{block.justType}</span>
            {block.isInstitutional && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Institucional</span>
            )}
            {block.isRecurring && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Repeat className="w-2.5 h-2.5" />Anual
              </span>
            )}
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">No Disponible</span>
          </div>
          <button
            onClick={() => onDelete(block.id)}
            className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-600 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <CalendarX className="w-3 h-3 text-gray-400" />
            <span>{block.dateFrom} — {block.dateTo} ({days} dia{days !== 1 ? 's' : ''})</span>
          </div>
          {!allDay && (
            <div className="pl-4 text-gray-500">{block.timeFrom} a {block.timeTo}</div>
          )}
          <div className="text-gray-500">{doctors}</div>
          <div className="text-gray-400">{block.branch} &bull; {block.description}</div>
        </div>

        {block.affectedCount > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 font-medium">
            <AlertTriangle className="w-3 h-3" />
            {block.affectedCount} cita{block.affectedCount !== 1 ? 's' : ''} en Reprogramacion Prioritaria
          </div>
        )}
      </div>
    </div>
  );
}

function TaskPanel({ appointments, onDismiss }: { appointments: MockAppointment[]; onDismiss: () => void }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-900">Lista de tareas generada para recepcion</h3>
        </div>
        <button onClick={onDismiss} className="text-blue-400 hover:text-blue-600 p-0.5 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-1.5">
        {appointments.map(a => (
          <div key={a.id}
            className="flex items-center justify-between bg-white border border-blue-100 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" />
              <div>
                <span className="text-sm font-medium text-gray-900">{a.patientName}</span>
                <span className="text-xs text-gray-500 ml-2">{a.date} - {a.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Phone className="w-3 h-3" />{a.phone}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-blue-700 mt-2">
        Notificaciones automaticas enviadas. Marcar cada tarea como completada al contactar al paciente.
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BloqueoAgenda() {
  const [activeTab, setActiveTab] = useState<TabKey>('periodo');
  const [blocks, setBlocks]       = useState<BlockedPeriod[]>(INITIAL_BLOCKS);
  const [savedOk, setSavedOk]     = useState(false);

  const [conflictAppts, setConflictAppts]         = useState<MockAppointment[]>([]);
  const [showConflictModal, setShowConflictModal]   = useState(false);
  const [pendingBlock, setPendingBlock]             = useState<BlockedPeriod | null>(null);
  const [taskAppts, setTaskAppts]                   = useState<MockAppointment[]>([]);

  const [instConflicts, setInstConflicts]           = useState<{ doctor: string; count: number }[]>([]);
  const [showInstConflict, setShowInstConflict]     = useState(false);
  const [pendingInstBlock, setPendingInstBlock]     = useState<BlockedPeriod | null>(null);

  const [pForm, setPForm] = useState<PeriodForm>({
    selectedDoctors: [],
    branch: 'Sucursal Central',
    dateFrom: '2026-06-18',
    dateTo: '2026-06-22',
    timeFrom: '00:00',
    timeTo: '23:59',
    justType: 'Vacaciones',
    description: '',
  });

  const [iForm, setIForm] = useState<InstForm>({
    eventName: '',
    date: '2026-12-25',
    isRecurring: true,
    selectedDoctors: [],
    justType: 'Feriado Nacional',
  });

  const flashSaved = () => {
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 4000);
  };

  const togglePDoctor = (id: string) =>
    setPForm(f => ({
      ...f,
      selectedDoctors: f.selectedDoctors.includes(id)
        ? f.selectedDoctors.filter(d => d !== id)
        : [...f.selectedDoctors, id],
    }));

  const toggleIDoctor = (id: string) =>
    setIForm(f => ({
      ...f,
      selectedDoctors: f.selectedDoctors.includes(id)
        ? f.selectedDoctors.filter(d => d !== id)
        : [...f.selectedDoctors, id],
    }));

  const handleConfirmPeriod = () => {
    if (!pForm.selectedDoctors.length || !pForm.description.trim()) return;

    const conflicts = findConflicts(pForm.dateFrom, pForm.dateTo, pForm.selectedDoctors);
    const block: BlockedPeriod = {
      id: `bp${Date.now()}`,
      doctorIds: pForm.selectedDoctors,
      branch: pForm.branch,
      dateFrom: pForm.dateFrom,
      dateTo: pForm.dateTo,
      timeFrom: pForm.timeFrom,
      timeTo: pForm.timeTo,
      justType: pForm.justType,
      description: pForm.description,
      isInstitutional: false,
      isRecurring: false,
      affectedCount: conflicts.length,
    };

    if (conflicts.length > 0) {
      setConflictAppts(conflicts);
      setPendingBlock(block);
      setShowConflictModal(true);
    } else {
      commitBlock(block, []);
    }
  };

  const commitBlock = (block: BlockedPeriod, appts: MockAppointment[]) => {
    setBlocks(prev => [...prev, block]);
    if (appts.length) setTaskAppts(appts);
    setPForm(f => ({ ...f, description: '', selectedDoctors: [] }));
    flashSaved();
  };

  const onConflictConfirm = () => {
    if (!pendingBlock) return;
    setShowConflictModal(false);
    commitBlock(pendingBlock, conflictAppts);
    setConflictAppts([]);
    setPendingBlock(null);
  };

  const handleConfirmInstitutional = () => {
    if (!iForm.eventName.trim() || !iForm.selectedDoctors.length) return;

    const conflicts = iForm.selectedDoctors
      .map(id => ({ doctor: getDoctorName(id), count: findConflicts(iForm.date, iForm.date, [id]).length }))
      .filter(dc => dc.count > 0);

    const block: BlockedPeriod = {
      id: `bp${Date.now()}`,
      doctorIds: iForm.selectedDoctors,
      branch: 'Todas',
      dateFrom: iForm.date,
      dateTo: iForm.date,
      timeFrom: '00:00',
      timeTo: '23:59',
      justType: iForm.justType,
      description: iForm.eventName,
      isInstitutional: true,
      isRecurring: iForm.isRecurring,
      affectedCount: conflicts.reduce((s, c) => s + c.count, 0),
    };

    if (conflicts.length > 0) {
      setInstConflicts(conflicts);
      setPendingInstBlock(block);
      setShowInstConflict(true);
    } else {
      setBlocks(prev => [...prev, block]);
      setIForm(f => ({ ...f, eventName: '', selectedDoctors: [] }));
      flashSaved();
    }
  };

  const onInstConflictConfirm = () => {
    if (!pendingInstBlock) return;
    setBlocks(prev => [...prev, pendingInstBlock]);
    setShowInstConflict(false);
    setInstConflicts([]);
    setPendingInstBlock(null);
    setIForm(f => ({ ...f, eventName: '', selectedDoctors: [] }));
    flashSaved();
  };

  const deleteBlock = (id: string) => setBlocks(prev => prev.filter(b => b.id !== id));

  const periodBlocks = blocks.filter(b => !b.isInstitutional);
  const instBlocks   = blocks.filter(b => b.isInstitutional);

  return (
    <div className="app-page p-6 min-h-full">
      {/* Toast */}
      {savedOk && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl
          flex items-center gap-2 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Bloqueo registrado. La agenda y el portal de reservas han sido actualizados.
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">Bloqueo de Dias o Periodos</h1>
        <p className="text-gray-500">
          Registra ausencias, vacaciones, feriados y eventos institucionales para bloquear la agenda.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {([
          ['periodo',       'Bloquear Periodo'],
          ['institucional', 'Bloqueo Institucional'],
        ] as [TabKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors -mb-px
              ${activeTab === key
                ? 'border-blue-600 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Bloquear Periodo ─────────────────────────────────────────── */}
      {activeTab === 'periodo' && (
        <div className="flex gap-4 items-start">
          {/* Form */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Datos del bloqueo</h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Doctor checkboxes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medico(s) afectado(s) <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-1.5 border border-gray-200 rounded-lg p-3">
                    {DOCTORS.map(d => (
                      <label key={d.id} className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 rounded p-0.5">
                        <input
                          type="checkbox"
                          checked={pForm.selectedDoctors.includes(d.id)}
                          onChange={() => togglePDoctor(d.id)}
                          className="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{d.name}</div>
                          <div className="text-xs text-gray-400">{d.specialty}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sucursal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={pForm.branch}
                      onChange={e => setPForm(f => ({ ...f, branch: e.target.value }))}
                      className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {BRANCHES.map(b => <option key={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Date range */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Desde <span className="text-red-500">*</span>
                    </label>
                    <input type="date" value={pForm.dateFrom}
                      onChange={e => setPForm(f => ({ ...f, dateFrom: e.target.value }))}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Hasta <span className="text-red-500">*</span>
                    </label>
                    <input type="date" value={pForm.dateTo}
                      onChange={e => setPForm(f => ({ ...f, dateTo: e.target.value }))}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Time range */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Hora inicio</label>
                    <input type="time" value={pForm.timeFrom}
                      onChange={e => setPForm(f => ({ ...f, timeFrom: e.target.value }))}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Hora fin</label>
                    <input type="time" value={pForm.timeTo}
                      onChange={e => setPForm(f => ({ ...f, timeTo: e.target.value }))}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Justification type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de justificacion <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={pForm.justType}
                      onChange={e => setPForm(f => ({ ...f, justType: e.target.value }))}
                      className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {JUSTIF_TYPES.map(j => <option key={j}>{j}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripcion <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={pForm.description}
                    onChange={e => setPForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Detalle el motivo del bloqueo..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-500 flex gap-2">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
                  El rango bloqueado se mostrara con estilo rayado "No Disponible" en la agenda y se
                  propagara al portal de reservas para impedir nuevas citas.
                </div>

                <button
                  onClick={handleConfirmPeriod}
                  disabled={!pForm.selectedDoctors.length || !pForm.description.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg
                    hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CalendarX className="w-4 h-4" />
                  Confirmar Bloqueo
                </button>
              </div>
            </div>
          </div>

          {/* Right: task panel + list */}
          <div className="flex-1 min-w-0 space-y-4">
            {taskAppts.length > 0 && (
              <TaskPanel appointments={taskAppts} onDismiss={() => setTaskAppts([])} />
            )}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Periodos bloqueados</h2>
                <span className="text-xs text-gray-500">
                  {periodBlocks.length} bloqueo{periodBlocks.length !== 1 ? 's' : ''}
                </span>
              </div>
              {periodBlocks.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <CalendarX className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Sin periodos bloqueados registrados.</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {periodBlocks.map(b => (
                    <BlockedPeriodCard key={b.id} block={b} onDelete={deleteBlock} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Bloqueo Institucional ────────────────────────────────────── */}
      {activeTab === 'institucional' && (
        <div className="flex gap-4 items-start">
          {/* Form */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Bloqueo Institucional</h2>
                <p className="text-xs text-gray-500 mt-0.5">Feriados nacionales y eventos de clinica.</p>
              </div>
              <div className="p-5 space-y-4">
                {/* Event name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del evento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Dia de la Independencia"
                    value={iForm.eventName}
                    onChange={e => setIForm(f => ({ ...f, eventName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={iForm.date}
                    onChange={e => setIForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Recurrence toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Recurrencia anual</p>
                      <p className="text-xs text-gray-500">Se aplica cada ano automaticamente</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIForm(f => ({ ...f, isRecurring: !f.isRecurring }))}
                    className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 relative ${iForm.isRecurring ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                      ${iForm.isRecurring ? 'translate-x-4' : ''}`} />
                  </button>
                </div>

                {/* Justification type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={iForm.justType}
                      onChange={e => setIForm(f => ({ ...f, justType: e.target.value }))}
                      className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {JUSTIF_TYPES.map(j => <option key={j}>{j}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Doctor selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Profesionales <span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={() => setIForm(f => ({
                        ...f,
                        selectedDoctors: f.selectedDoctors.length === DOCTORS.length
                          ? []
                          : DOCTORS.map(d => d.id),
                      }))}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {iForm.selectedDoctors.length === DOCTORS.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                    </button>
                  </div>
                  <div className="space-y-1.5 border border-gray-200 rounded-lg p-3">
                    {DOCTORS.map(d => (
                      <label key={d.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-0.5">
                        <input
                          type="checkbox"
                          checked={iForm.selectedDoctors.includes(d.id)}
                          onChange={() => toggleIDoctor(d.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-900">{d.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleConfirmInstitutional}
                  disabled={!iForm.eventName.trim() || !iForm.selectedDoctors.length}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg
                    hover:bg-purple-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Users className="w-4 h-4" />
                  Aplicar a Seleccionados ({iForm.selectedDoctors.length})
                </button>
              </div>
            </div>
          </div>

          {/* Institutional block list */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Bloqueos institucionales</h2>
                <span className="text-xs text-gray-500">
                  {instBlocks.length} bloqueo{instBlocks.length !== 1 ? 's' : ''}
                </span>
              </div>
              {instBlocks.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <CalendarX className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Sin bloqueos institucionales registrados.</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {instBlocks.map(b => (
                    <BlockedPeriodCard key={b.id} block={b} onDelete={deleteBlock} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showConflictModal && (
        <ConflictModal
          appointments={conflictAppts}
          onCancel={() => { setShowConflictModal(false); setConflictAppts([]); setPendingBlock(null); }}
          onConfirm={onConflictConfirm}
        />
      )}
      {showInstConflict && (
        <InstConflictModal
          doctorConflicts={instConflicts}
          onClose={() => { setShowInstConflict(false); setInstConflicts([]); setPendingInstBlock(null); }}
          onConfirm={onInstConflictConfirm}
        />
      )}
    </div>
  );
}
