// Helpers to turn the flat permission catalog (`<module>.<action>`) coming from
// GET /roles/permissions into a grid: rows = modules, columns = actions.
//
// The backend derives every permission from MODULES × ACTIONS plus standalone
// read-only audit-log permissions (see PermissionCatalog on the backend), and
// returns them as plain NAMES (no ids). So the grid works with permission names.

// Action columns, in the order shown in the design.
export const ACTIONS = ['read', 'create', 'update', 'delete'] as const;
export type Action = (typeof ACTIONS)[number];

export const ACTION_LABELS: Record<Action, string> = {
  read: 'Ver',
  create: 'Crear',
  update: 'Editar',
  delete: 'Eliminar',
};

// Human-readable labels per module (raw key → display label).
const MODULE_LABELS: Record<string, string> = {
  users: 'Usuarios',
  roles: 'Roles',
  patients: 'Pacientes',
  diagnoses: 'Diagnósticos',
  diseases: 'Enfermedades',
  drugs: 'Medicamentos',
  priorities: 'Prioridades',
  treatments: 'Tratamientos',
  logs_users: 'Bitácora usuarios',
  logs_roles: 'Bitácora roles',
};

// One grid row: a module and the permission NAME available for each action
// (absent when that action doesn't exist for the module, e.g. logs only have "read").
export interface PermissionRow {
  module: string;                              // raw module key, e.g. "users", "logs_users"
  label: string;                               // display label, e.g. "Usuarios"
  actions: Partial<Record<Action, string>>;    // action -> permission name
}

const isAction = (word: string): word is Action =>
  (ACTIONS as readonly string[]).includes(word);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const labelFor = (module: string): string => MODULE_LABELS[module] ?? capitalize(module);

/**
 * Group a flat permission name list into grid rows by module.
 * Each permission name is "<module>.<action>" (module keys never contain a dot,
 * e.g. "logs_users.read"), so we split on the first dot.
 */
export function buildPermissionGrid(permissions: string[]): PermissionRow[] {
  const byModule = new Map<string, PermissionRow>();

  for (const name of permissions) {
    const dot = name.indexOf('.');
    if (dot === -1) continue;
    const module = name.slice(0, dot);
    const action = name.slice(dot + 1);
    if (!isAction(action)) continue;

    let row = byModule.get(module);
    if (!row) {
      row = { module, label: labelFor(module), actions: {} };
      byModule.set(module, row);
    }
    row.actions[action] = name;
  }

  // Preserve catalog order (permissions come ordered by name from the backend).
  return Array.from(byModule.values());
}

// ─── Coupled permissions (UX-only cascade) ──────────────────────────────────────
//
// The backend applies the cascade on save (create/update/delete imply read via
// PermissionCatalog::expand), so the front mirrors it for immediate feedback:
// enabling a write action turns its module's "read" on; turning "read" off turns
// every write action of that module off. Logs only have "read", so no cascade.

const WRITE_ACTIONS: Action[] = ['create', 'update', 'delete'];

const moduleOf = (name: string): string | null => {
  const dot = name.indexOf('.');
  return dot === -1 ? null : name.slice(0, dot);
};

const actionOf = (name: string): string | null => {
  const dot = name.indexOf('.');
  return dot === -1 ? null : name.slice(dot + 1);
};

/**
 * Turn a permission ON, cascading forward: enabling a write action also enables
 * the module's "read" (e.g. "users.update" → "users.read").
 */
export function enableWithDeps(selected: Set<string>, name: string): Set<string> {
  const next = new Set(selected);
  next.add(name);

  const module = moduleOf(name);
  const action = actionOf(name);
  if (module && action && WRITE_ACTIONS.includes(action as Action)) {
    next.add(`${module}.read`);
  }
  return next;
}

/**
 * Turn a permission OFF, cascading backward: disabling a module's "read" also
 * disables every write action of that module (a write with no read is invalid).
 */
export function disableWithDeps(selected: Set<string>, name: string): Set<string> {
  const next = new Set(selected);
  next.delete(name);

  // If we just turned off a "<module>.read", drop that module's write actions too.
  if (actionOf(name) === 'read') {
    const module = moduleOf(name);
    if (module) {
      for (const action of WRITE_ACTIONS) {
        next.delete(`${module}.${action}`);
      }
    }
  }
  return next;
}
