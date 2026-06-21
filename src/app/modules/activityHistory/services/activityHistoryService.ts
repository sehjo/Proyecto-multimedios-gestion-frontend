import type { ActivityEntry } from '../types/activityHistory.types';

const MOCK_ACTIVITIES: ActivityEntry[] = [
  { id: 1,  user: 'Ricardo Solano',  role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',    date: '2026-06-09', time: '07:02', details: 'Acceso desde IP 192.168.1.10',                 result: 'Exitoso' },
  { id: 2,  user: 'Elena Mora',      role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',    date: '2026-06-09', time: '07:15', details: 'Acceso desde IP 192.168.1.22',                 result: 'Exitoso' },
  { id: 3,  user: 'Admin Sistema',   role: 'Administrador',  action: 'Creación',         module: 'Usuarios',         date: '2026-06-09', time: '08:30', details: 'Nuevo usuario: Dra. Laura Torres',             result: 'Exitoso' },
  { id: 4,  user: 'Ricardo Solano',  role: 'Doctor',         action: 'Creación',         module: 'Pacientes',        date: '2026-06-09', time: '08:45', details: 'Paciente: Jorge Ramírez (ID 5)',               result: 'Exitoso' },
  { id: 5,  user: 'Elena Mora',      role: 'Doctor',         action: 'Edición',          module: 'Historial Médico', date: '2026-06-09', time: '09:10', details: 'Consulta ID 4 – María González',               result: 'Exitoso' },
  { id: 6,  user: 'Andrés Castro',   role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',    date: '2026-06-09', time: '09:20', details: 'Acceso desde IP 192.168.1.35',                 result: 'Exitoso' },
  { id: 7,  user: 'Admin Sistema',   role: 'Administrador',  action: 'Exportación',      module: 'Reportes',         date: '2026-06-09', time: '09:45', details: 'Reporte de pacientes atendidos (PDF)',         result: 'Exitoso' },
  { id: 8,  user: 'Ricardo Solano',  role: 'Doctor',         action: 'Creación',         module: 'Citas',            date: '2026-06-09', time: '10:00', details: 'Cita asignada: Carlos Méndez – 10 jun',        result: 'Exitoso' },
  { id: 9,  user: 'Elena Mora',      role: 'Doctor',         action: 'Eliminación',      module: 'Citas',            date: '2026-06-09', time: '10:30', details: 'Cita ID 5 cancelada (Ana Vargas)',             result: 'Exitoso' },
  { id: 10, user: 'Andrés Castro',   role: 'Doctor',         action: 'Edición',          module: 'Pacientes',        date: '2026-06-09', time: '10:55', details: 'Datos de Luis Herrera actualizados',           result: 'Exitoso' },
  { id: 11, user: 'Admin Sistema',   role: 'Administrador',  action: 'Inicio de sesión', module: 'Autenticación',    date: '2026-06-08', time: '08:00', details: 'Acceso desde IP 10.0.0.1',                    result: 'Exitoso' },
  { id: 12, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Exportación',      module: 'Reportes',         date: '2026-06-08', time: '08:20', details: 'Reporte de ocupación por doctor (PDF)',        result: 'Exitoso' },
  { id: 13, user: 'Elena Mora',      role: 'Doctor',         action: 'Creación',         module: 'Historial Médico', date: '2026-06-08', time: '09:00', details: 'Nueva consulta para Jorge Ramírez',            result: 'Exitoso' },
  { id: 14, user: 'Andrés Castro',   role: 'Doctor',         action: 'Eliminación',      module: 'Pacientes',        date: '2026-06-08', time: '09:30', details: 'Intento de eliminar paciente ID 3 denegado',  result: 'Fallido' },
  { id: 15, user: 'Admin Sistema',   role: 'Administrador',  action: 'Edición',          module: 'Usuarios',         date: '2026-06-08', time: '10:10', details: 'Rol de Elena Mora actualizado a Especialista', result: 'Exitoso' },
  { id: 16, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Cierre de sesión', module: 'Autenticación',    date: '2026-06-08', time: '13:00', details: 'Sesión cerrada manualmente',                  result: 'Exitoso' },
  { id: 17, user: 'Elena Mora',      role: 'Doctor',         action: 'Cierre de sesión', module: 'Autenticación',    date: '2026-06-08', time: '13:05', details: 'Sesión cerrada manualmente',                  result: 'Exitoso' },
  { id: 18, user: 'Admin Sistema',   role: 'Administrador',  action: 'Creación',         module: 'Usuarios',         date: '2026-06-07', time: '07:45', details: 'Nuevo usuario: Andrés Castro (doctor)',        result: 'Exitoso' },
  { id: 19, user: 'Andrés Castro',   role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',    date: '2026-06-07', time: '08:00', details: 'Primer acceso al sistema',                    result: 'Exitoso' },
  { id: 20, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Edición',          module: 'Historial Médico', date: '2026-06-07', time: '09:15', details: 'Consulta ID 1 – Carlos Méndez actualizada',   result: 'Exitoso' },
  { id: 21, user: 'Elena Mora',      role: 'Doctor',         action: 'Creación',         module: 'Citas',            date: '2026-06-07', time: '10:00', details: 'Cita para María González – 12 jun',            result: 'Exitoso' },
  { id: 22, user: 'Admin Sistema',   role: 'Administrador',  action: 'Exportación',      module: 'Reportes',         date: '2026-06-07', time: '11:30', details: 'Reporte de citas exportado (PDF)',             result: 'Exitoso' },
  { id: 23, user: 'Andrés Castro',   role: 'Doctor',         action: 'Edición',          module: 'Citas',            date: '2026-06-07', time: '12:00', details: 'Reprogramación de cita ID 10',                result: 'Exitoso' },
  { id: 24, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Eliminación',      module: 'Historial Médico', date: '2026-06-06', time: '08:30', details: 'Medicamento ID 2 eliminado de consulta ID 3', result: 'Exitoso' },
  { id: 25, user: 'Admin Sistema',   role: 'Administrador',  action: 'Inicio de sesión', module: 'Autenticación',    date: '2026-06-06', time: '09:00', details: 'Acceso desde IP 10.0.0.1',                    result: 'Exitoso' },
  { id: 26, user: 'Elena Mora',      role: 'Doctor',         action: 'Edición',          module: 'Pacientes',        date: '2026-06-06', time: '09:45', details: 'Datos de Ana Vargas actualizados',             result: 'Exitoso' },
  { id: 27, user: 'Andrés Castro',   role: 'Doctor',         action: 'Creación',         module: 'Historial Médico', date: '2026-06-06', time: '10:20', details: 'Consulta para Carlos Méndez registrada',      result: 'Exitoso' },
  { id: 28, user: 'Admin Sistema',   role: 'Administrador',  action: 'Eliminación',      module: 'Usuarios',         date: '2026-06-05', time: '08:00', details: 'Usuario inactivo eliminado (ID 9)',            result: 'Exitoso' },
  { id: 29, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',    date: '2026-06-05', time: '07:58', details: 'Intento con contraseña incorrecta',           result: 'Fallido' },
  { id: 30, user: 'Ricardo Solano',  role: 'Doctor',         action: 'Inicio de sesión', module: 'Autenticación',    date: '2026-06-05', time: '08:02', details: 'Acceso exitoso tras reintento',                result: 'Exitoso' },
];

export function getActivities(): ActivityEntry[] {
  return MOCK_ACTIVITIES;
}
