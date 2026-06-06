import { useState, useMemo } from 'react';
import {
  Clock, Save, Trash2, Edit, AlertTriangle,
  ChevronDown, X, CheckCircle, Info,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type EditMode  = 'individual' | 'masivo';
type BlockType = 'available' | 'blocked' | 'break';

interface ScheduleBlock {
  id: string;
  doctorId: string;
  branch: string;
  days: number[];        // 0 = Lun, 4 = Vie
  startTime: string;
  endTime: string;
  slotDuration: number;  // minutes
  type: BlockType;
  label: string;
  isRecurring: boolean;
  specificDate?: string;
  hasAppointments: boolean;
  appointmentCount: number;
}

interface FormState {
  date: string;
  days: number[];
  startTime: string;
  endTime: string;
  slotDuration: number;
  dateFrom: string;
  dateTo: string;
  blockType: BlockType;
  label: string;
}

// ─── Constants & mock data ────────────────────────────────────────────────────

const DOCTORS = [
  { id: '1', name: 'Dra. Ana Vargas',     specialty: 'Medicina General' },
  { id: '2', name: 'Dr. Luis Mora',        specialty: 'Cardiologia'     },
  { id: '3', name: 'Dra. Carmen Solis',    specialty: 'Pediatria'       },
  { id: '4', name: 'Dr. Roberto Jimenez',  specialty: 'Ortopedia'       },
];

const BRANCHES     = ['Sucursal Central', 'Sucursal Norte', 'Sucursal Sur'];
const SLOT_OPTIONS = [15, 20, 30, 45, 60];
const DAY_LABELS   = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'];
const HOURS        = Array.from({ length: 12 }, (_, i) => i + 7); // 07-18

const MOCK_APPTS_IN_BLOCKS = [
  { patient: 'Maria Gonzalez',   time: '08:00', blockLabel: 'Consulta Matutina'   },
  { patient: 'Carlos Rodriguez', time: '09:00', blockLabel: 'Consulta Matutina'   },
  { patient: 'Laura Mendez',     time: '10:30', blockLabel: 'Consulta Matutina'   },
  { patient: 'Diana Castillo',   time: '14:00', blockLabel: 'Consulta Vespertina' },
  { patient: 'Jorge Salazar',    time: '15:30', blockLabel: 'Consulta Vespertina' },
];

const INITIAL_BLOCKS: ScheduleBlock[] = [
  {
    id: 'b1', doctorId: '1', branch: 'Sucursal Central',
    days: [0,1,2,3,4], startTime: '07:00', endTime: '12:00',
    slotDuration: 30, type: 'available', label: 'Consulta Matutina',
    isRecurring: true, hasAppointments: true, appointmentCount: 3,
  },
  {
    id: 'b2', doctorId: '1', branch: 'Sucursal Central',
    days: [0,1,2,3,4], startTime: '12:00', endTime: '13:00',
    slotDuration: 60, type: 'break', label: 'Almuerzo',
    isRecurring: true, hasAppointments: false, appointmentCount: 0,
  },
  {
    id: 'b3', doctorId: '1', branch: 'Sucursal Central',
    days: [0,1,2,3,4], startTime: '13:00', endTime: '17:00',
    slotDuration: 30, type: 'available', label: 'Consulta Vespertina',
    isRecurring: true, hasAppointments: true, appointmentCount: 2,
  },
  {
    id: 'b4', doctorId: '1', branch: 'Sucursal Central',
    days: [2], startTime: '14:00', endTime: '16:00',
    slotDuration: 60, type: 'blocked', label: 'Reunion de equipo',
    isRecurring: false, specificDate: '2026-06-10',
    hasAppointments: false, appointmentCount: 0,
  },
  {
    id: 'b5', doctorId: '2', branch: 'Sucursal Norte',
    days: [0,2,4], startTime: '07:00', endTime: '11:00',
    slotDuration: 20, type: 'available', label: 'Consulta Norte',
    isRecurring: true, hasAppointments: true, appointmentCount: 3,
  },
];

const BLOCK_CFG: Record<BlockType, {
  label: string; bg: string; text: string; dot: string; badge: string;
}> = {
  available: {
    label: 'Disponible',
    bg: 'bg-green-50', text: 'text-green-800',
    dot: 'bg-green-500', badge: 'bg-green-100 text-green-700',
  },
  blocked: {
    label: 'Bloqueado',
    bg: 'bg-gray-100', text: 'text-gray-700',
    dot: 'bg-gray-400', badge: 'bg-gray-200 text-gray-600',
  },
  break: {
    label: 'Descanso',
    bg: 'bg-orange-50', text: 'text-orange-800',
    dot: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timesOverlap(s1: string, e1: string, s2: string, e2: string) {
  return s1 < e2 && e1 > s2;
}

function hourOf(t: string) {
  return parseInt(t.split(':')[0], 10);
}

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// ─── Mini weekly grid ─────────────────────────────────────────────────────────

function MiniGrid({ blocks }: { blocks: ScheduleBlock[] }) {
  const priority: Record<BlockType, number> = { blocked: 3, break: 2, available: 1 };
  const cells: JSX.Element[] = [];

  cells.push(<div key="corner" className="bg-gray-50 border-b border-r border-gray-200 h-8" />);
  DAY_LABELS.forEach(d =>
    cells.push(
      <div key={`hd-${d}`}
        className="text-xs font-semibold text-gray-600 text-center py-2 bg-gray-50 border-b border-r border-gray-200 last:border-r-0">
        {d}
      </div>
    )
  );

  HOURS.forEach(hour => {
    cells.push(
      <div key={`row-${hour}`}
        className="text-xs text-gray-400 border-b border-r border-gray-200 bg-gray-50 px-1 py-1 flex items-center">
        {String(hour).padStart(2, '0')}:00
      </div>
    );
    [0, 1, 2, 3, 4].forEach(day => {
      const matched = blocks
        .filter(b =>
          b.days.includes(day) &&
          hourOf(b.startTime) <= hour &&
          hourOf(b.endTime) > hour
        )
        .sort((a, b_) => priority[b_.type] - priority[a.type]);
      const block   = matched[0];
      const cfg     = block ? BLOCK_CFG[block.type] : null;
      const isFirst = block && hourOf(block.startTime) === hour;
      cells.push(
        <div key={`cell-${hour}-${day}`}
          className={`border-b border-r border-gray-200 last:border-r-0 min-h-[36px] px-1 py-0.5 ${cfg ? cfg.bg : 'bg-white'}`}>
          {isFirst && cfg && (
            <div className={`text-xs font-medium truncate ${cfg.text}`}>{block.label}</div>
          )}
        </div>
      );
    });
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <div className="grid" style={{ gridTemplateColumns: '3rem repeat(5, 1fr)', minWidth: '380px' }}>
        {cells}
      </div>
    </div>
  );
}

// ─── Mass Edit Modal ──────────────────────────────────────────────────────────

function MassEditModal({ count, onClose, onConfirm }: {
  count: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [newStart,    setNewStart]    = useState('07:00');
  const [newEnd,      setNewEnd]      = useState('12:00');
  const [newDuration, setNewDuration] = useState(30);
  const [just,        setJust]        = useState('');

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Editar masivamente</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {count} bloque{count !== 1 ? 's' : ''} seleccionado{count !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex gap-2 text-sm text-blue-800">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Los cambios se aplicaran a los {count} bloques seleccionados y actualizaran
            la cuadricula de la agenda y el portal de pacientes de inmediato.
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva hora inicio</label>
              <input type="time" value={newStart} onChange={e => setNewStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva hora fin</label>
              <input type="time" value={newEnd} onChange={e => setNewEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva duracion de turno</label>
            <div className="relative">
              <select value={newDuration} onChange={e => setNewDuration(+e.target.value)}
                className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {SLOT_OPTIONS.map(s => <option key={s} value={s}>{s} minutos</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Justificacion administrativa <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={just}
              onChange={e => setJust(e.target.value)}
              placeholder="Describa el motivo del cambio masivo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
            Cancelar
          </button>
          <button
            onClick={() => { if (just.trim()) onConfirm(); }}
            disabled={!just.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Mass Delete Modal ────────────────────────────────────────────────────────

function MassDeleteModal({ selectedBlocks, onClose, onConfirm }: {
  selectedBlocks: ScheduleBlock[];
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [just, setJust] = useState('');

  const blocksWithAppts = selectedBlocks.filter(b => b.hasAppointments);
  const totalAppts      = blocksWithAppts.reduce((s, b) => s + b.appointmentCount, 0);
  const hasAppts        = blocksWithAppts.length > 0;
  const affectedAppts   = MOCK_APPTS_IN_BLOCKS.filter(a =>
    blocksWithAppts.some(b => b.label === a.blockLabel)
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Eliminar bloques horarios</h3>
              <p className="text-sm text-gray-500">
                {selectedBlocks.length} bloque{selectedBlocks.length !== 1 ? 's' : ''} seleccionado{selectedBlocks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {hasAppts && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-4">
            <div className="flex gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-semibold text-red-800">
                Advertencia: citas programadas en estos bloques
              </span>
            </div>
            <p className="text-xs text-red-700 mb-3">
              {totalAppts} cita{totalAppts !== 1 ? 's' : ''} debe{totalAppts !== 1 ? 'n' : ''} ser
              reubicada{totalAppts !== 1 ? 's' : ''} antes de confirmar la eliminacion:
            </p>
            <div className="space-y-1">
              {affectedAppts.map((a, i) => (
                <div key={i}
                  className="flex items-center justify-between text-xs bg-white border border-red-200 rounded px-2 py-1.5">
                  <span className="font-medium text-gray-900">{a.patient}</span>
                  <span className="text-gray-500">{a.time} — {a.blockLabel}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex gap-2 text-sm text-yellow-800">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Al eliminar estos bloques los horarios dejaran de estar disponibles en el portal
            de pacientes de forma inmediata.
          </span>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Justificacion administrativa <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={just}
            onChange={e => setJust(e.target.value)}
            placeholder="Describa el motivo de la eliminacion..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
            Cancelar
          </button>
          <button
            onClick={() => { if (just.trim()) onConfirm(); }}
            disabled={!just.trim()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            Confirmar Eliminacion
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Conflict Banner ──────────────────────────────────────────────────────────

function ConflictBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-300 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-800">Conflicto de disponibilidad detectado</p>
          <p className="text-xs text-red-700 mt-0.5">{message}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HorarioConfig() {
  const [editMode,        setEditMode]        = useState<EditMode>('individual');
  const [selectedDoctor,  setSelectedDoctor]  = useState('1');
  const [selectedBranch,  setSelectedBranch]  = useState('Sucursal Central');
  const [blocks,          setBlocks]          = useState<ScheduleBlock[]>(INITIAL_BLOCKS);
  const [selectedIds,     setSelectedIds]     = useState<string[]>([]);
  const [hasConflict,     setHasConflict]     = useState(false);
  const [conflictMsg,     setConflictMsg]     = useState('');
  const [showMassEdit,    setShowMassEdit]    = useState(false);
  const [showMassDelete,  setShowMassDelete]  = useState(false);
  const [savedOk,         setSavedOk]         = useState(false);

  const [form, setForm] = useState<FormState>({
    date: '2026-06-15',
    days: [],
    startTime: '07:00',
    endTime: '12:00',
    slotDuration: 30,
    dateFrom: '2026-06-08',
    dateTo: '2026-06-30',
    blockType: 'available',
    label: '',
  });

  const doctorBlocks = useMemo(
    () => blocks.filter(b => b.doctorId === selectedDoctor && b.branch === selectedBranch),
    [blocks, selectedDoctor, selectedBranch]
  );

  const selectedBlockObjects = useMemo(
    () => blocks.filter(b => selectedIds.includes(b.id)),
    [blocks, selectedIds]
  );

  const slotCount = useMemo(() => {
    const start = toMinutes(form.startTime);
    const end   = toMinutes(form.endTime);
    const diff  = end - start;
    return diff > 0 ? Math.floor(diff / form.slotDuration) : 0;
  }, [form.startTime, form.endTime, form.slotDuration]);

  const updateField = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm(f => ({ ...f, [k]: v }));
    setHasConflict(false);
  };

  const toggleDay = (day: number) => {
    setForm(f => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day],
    }));
    setHasConflict(false);
  };

  // Convert a YYYY-MM-DD date string to 0-4 (Mon-Fri)
  const dateToDayIndex = (dateStr: string) => {
    const js = new Date(dateStr + 'T12:00:00').getDay(); // 0=Sun
    return js === 0 ? -1 : js - 1; // -1 for Sunday (skip)
  };

  const handleSave = () => {
    const formDays =
      editMode === 'individual'
        ? [dateToDayIndex(form.date)].filter(d => d >= 0)
        : form.days;

    const conflict = doctorBlocks.find(b => {
      const dayOverlap = formDays.some(d => b.days.includes(d));
      if (!dayOverlap) return false;
      return timesOverlap(form.startTime, form.endTime, b.startTime, b.endTime);
    });

    if (conflict) {
      setConflictMsg(
        `El bloque "${conflict.label}" (${conflict.startTime}-${conflict.endTime}) se superpone con el horario propuesto. Corrija el cruce antes de guardar.`
      );
      setHasConflict(true);
      return;
    }

    const newBlock: ScheduleBlock = {
      id: `b${Date.now()}`,
      doctorId: selectedDoctor,
      branch: selectedBranch,
      days: formDays,
      startTime: form.startTime,
      endTime: form.endTime,
      slotDuration: form.slotDuration,
      type: form.blockType,
      label: form.label.trim() || (
        form.blockType === 'available' ? 'Consulta' :
        form.blockType === 'break'     ? 'Descanso' : 'Bloqueo'
      ),
      isRecurring: editMode === 'masivo',
      specificDate: editMode === 'individual' ? form.date : undefined,
      hasAppointments: false,
      appointmentCount: 0,
    };

    setBlocks(prev => [...prev, newBlock]);
    setHasConflict(false);
    setForm(f => ({ ...f, label: '', days: [] }));
    flashSaved();
  };

  const flashSaved = () => {
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 3500);
  };

  const toggleSelect = (id: string) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const selectAll = () =>
    setSelectedIds(doctorBlocks.map(b => b.id));

  const handleMassEditConfirm = () => {
    setShowMassEdit(false);
    setSelectedIds([]);
    flashSaved();
  };

  const handleMassDeleteConfirm = () => {
    setBlocks(prev => prev.filter(b => !selectedIds.includes(b.id)));
    setShowMassDelete(false);
    setSelectedIds([]);
  };

  const doctorInfo = DOCTORS.find(d => d.id === selectedDoctor);

  return (
    <div className="app-page p-6 min-h-full">

      {/* Success toast */}
      {savedOk && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl
          flex items-center gap-2 text-sm font-medium animate-pulse">
          <CheckCircle className="w-4 h-4" />
          Bloque guardado. La agenda y el portal de pacientes han sido actualizados.
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">Configuracion de Bloques Horarios</h1>
        <p className="text-gray-500">Define la disponibilidad horaria de cada medico por sucursal.</p>
      </div>

      {/* Doctor + Branch filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <span className="text-sm font-medium text-gray-500">Doctor:</span>
        <div className="relative">
          <select
            value={selectedDoctor}
            onChange={e => { setSelectedDoctor(e.target.value); setSelectedIds([]); setHasConflict(false); }}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        <span className="text-sm font-medium text-gray-500 ml-2">Sucursal:</span>
        <div className="relative">
          <select
            value={selectedBranch}
            onChange={e => { setSelectedBranch(e.target.value); setSelectedIds([]); setHasConflict(false); }}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {BRANCHES.map(b => <option key={b}>{b}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {doctorInfo && (
          <div className="ml-auto flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {doctorInfo.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-900">{doctorInfo.name}</span>
              <span className="text-gray-400 mx-1">|</span>
              <span className="text-gray-500">{doctorInfo.specialty}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main body */}
      <div className="flex gap-4 items-start">

        {/* ── LEFT: Configuration form ── */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Nuevo bloque horario</h2>
            </div>

            <div className="p-5 space-y-4">

              {/* Mode toggle */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Modo de edicion
                </label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  {(['individual', 'masivo'] as EditMode[]).map(m => (
                    <button
                      key={m}
                      onClick={() => { setEditMode(m); setHasConflict(false); }}
                      className={`flex-1 py-2 text-sm font-medium capitalize transition-colors
                        ${m !== 'individual' ? 'border-l border-gray-200' : ''}
                        ${editMode === m ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {editMode === 'individual'
                    ? 'Aplica a una fecha especifica.'
                    : 'Crea una regla recurrente por dias de la semana.'}
                </p>
              </div>

              {/* Block type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de bloque <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.blockType}
                    onChange={e => updateField('blockType', e.target.value as BlockType)}
                    className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Disponible (consulta)</option>
                    <option value="blocked">Bloqueado</option>
                    <option value="break">Descanso</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
                <input
                  type="text"
                  maxLength={60}
                  placeholder="ej. Consulta Matutina"
                  value={form.label}
                  onChange={e => updateField('label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Individual: specific date */}
              {editMode === 'individual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha especifica <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => updateField('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Masivo: weekdays + date range */}
              {editMode === 'masivo' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dias de la semana <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-1">
                      {DAY_LABELS.map((d, i) => (
                        <button
                          key={d}
                          onClick={() => toggleDay(i)}
                          className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors
                            ${form.days.includes(i)
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'}
                          `}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Vigencia desde</label>
                      <input
                        type="date"
                        value={form.dateFrom}
                        onChange={e => updateField('dateFrom', e.target.value)}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Vigencia hasta</label>
                      <input
                        type="date"
                        value={form.dateTo}
                        onChange={e => updateField('dateTo', e.target.value)}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora inicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={e => updateField('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={e => updateField('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Slot duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duracion del turno <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.slotDuration}
                    onChange={e => updateField('slotDuration', +e.target.value)}
                    className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SLOT_OPTIONS.map(s => <option key={s} value={s}>{s} minutos</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                {slotCount > 0 && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Genera {slotCount} turno{slotCount !== 1 ? 's' : ''} de {form.slotDuration} min
                  </p>
                )}
              </div>

              {/* Conflict alert */}
              {hasConflict && <ConflictBanner message={conflictMsg} />}

              {/* Save */}
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <Save className="w-4 h-4" />
                Guardar Horario
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Block manager ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Bulk action bar */}
          {selectedIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-blue-800">
                {selectedIds.length} bloque{selectedIds.length !== 1 ? 's' : ''} seleccionado{selectedIds.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setShowMassEdit(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                Editar Masivamente
              </button>
              <button
                onClick={() => setShowMassDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="ml-auto text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mini grid */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Cuadricula semanal</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Disponible
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />Descanso
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />Bloqueado
                </span>
              </div>
            </div>
            <MiniGrid blocks={doctorBlocks} />
          </div>

          {/* Block list */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Bloques configurados</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {doctorBlocks.length} bloque{doctorBlocks.length !== 1 ? 's' : ''}
                </span>
                {doctorBlocks.length > 0 && (
                  <button
                    onClick={selectedIds.length === doctorBlocks.length ? () => setSelectedIds([]) : selectAll}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {selectedIds.length === doctorBlocks.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                  </button>
                )}
              </div>
            </div>

            {doctorBlocks.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Sin bloques configurados para este doctor y sucursal.</p>
                <p className="text-xs text-gray-400 mt-1">Usa el formulario para agregar el primer bloque.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {doctorBlocks.map(b => {
                  const cfg        = BLOCK_CFG[b.type];
                  const isSelected = selectedIds.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      onClick={() => toggleSelect(b.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                        ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(b.id)}
                        onClick={e => e.stopPropagation()}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer flex-shrink-0"
                      />
                      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${cfg.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="font-semibold text-gray-900 text-sm">{b.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                          {b.isRecurring
                            ? <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Semanal</span>
                            : <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Individual</span>
                          }
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {b.startTime} - {b.endTime}
                          </span>
                          <span>{b.slotDuration} min/turno</span>
                          <span>
                            {b.isRecurring
                              ? b.days.map(d => DAY_LABELS[d]).join(', ')
                              : b.specificDate}
                          </span>
                          {b.hasAppointments && (
                            <span className="flex items-center gap-1 text-amber-600 font-medium">
                              <AlertTriangle className="w-3 h-3" />
                              {b.appointmentCount} cita{b.appointmentCount !== 1 ? 's' : ''} programada{b.appointmentCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showMassEdit && (
        <MassEditModal
          count={selectedIds.length}
          onClose={() => setShowMassEdit(false)}
          onConfirm={handleMassEditConfirm}
        />
      )}
      {showMassDelete && (
        <MassDeleteModal
          selectedBlocks={selectedBlockObjects}
          onClose={() => setShowMassDelete(false)}
          onConfirm={handleMassDeleteConfirm}
        />
      )}
    </div>
  );
}
