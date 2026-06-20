import type { ActivityFilters } from './types/activityHistory.types';

export const ACTION_TYPES = [
  { value: '', label: 'Todas las acciones' },
  { value: 'Inicio de sesión', label: 'Inicio de sesión' },
  { value: 'Cierre de sesión', label: 'Cierre de sesión' },
  { value: 'Creación', label: 'Creación' },
  { value: 'Edición', label: 'Edición' },
  { value: 'Eliminación', label: 'Eliminación' },
  { value: 'Exportación', label: 'Exportación' },
];

export const MODULES = [
  { value: '', label: 'Todos los módulos' },
  { value: 'Pacientes', label: 'Pacientes' },
  { value: 'Citas', label: 'Citas' },
  { value: 'Historial Médico', label: 'Historial Médico' },
  { value: 'Usuarios', label: 'Usuarios' },
  { value: 'Autenticación', label: 'Autenticación' },
  { value: 'Reportes', label: 'Reportes' },
];

export const PAGE_SIZE = 10;

export const EMPTY_FILTERS: ActivityFilters = { user: '', action: '', module: '', date: '' };

export const ACTION_STYLE: Record<string, { bg: string; text: string }> = {
  'Inicio de sesión': { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  'Cierre de sesión': { bg: 'bg-gray-100',   text: 'text-gray-600'   },
  'Creación':         { bg: 'bg-green-100',  text: 'text-green-700'  },
  'Edición':          { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  'Eliminación':      { bg: 'bg-red-100',    text: 'text-red-600'    },
  'Exportación':      { bg: 'bg-orange-100', text: 'text-orange-600' },
};
