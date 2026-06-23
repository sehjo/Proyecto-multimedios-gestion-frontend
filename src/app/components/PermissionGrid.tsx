import { useRef } from 'react';
import { ACTIONS, ACTION_LABELS, PermissionRow } from '../lib/permissions';

interface PermissionGridProps {
  rows: PermissionRow[];
  /** Set of permission NAMES shown as ON. */
  selected: Set<string>;
  /** Toggle a permission name. Omitted/disabled → read-only grid. */
  onToggle?: (permissionName: string) => void;
  disabled?: boolean;
}

/**
 * Module × action grid of permission toggles.
 * Rows = modules, columns = Ver / Crear / Editar / Eliminar.
 * A cell with no matching permission for that action renders blank.
 */
export default function PermissionGrid({
  rows, selected, onToggle, disabled,
}: PermissionGridProps) {
  const readOnly = disabled || !onToggle;

  // Drag-to-scroll: let the user pan the grid horizontally by holding the mouse
  // and dragging. We only treat it as a drag once the pointer moves past a few
  // pixels, so a plain click still lands on the toggle underneath. While
  // dragging we suppress the click so the toggle doesn't fire at drag end.
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return; // nothing to scroll
    drag.current = { active: true, moved: false, startX: e.pageX, startLeft: el.scrollLeft };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.pageX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = () => { drag.current.active = false; };

  // Swallow the click that follows a real drag so toggles don't flip on release.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  // overflow-x-auto + min-w on the table: on narrow viewports the action
  // columns (Eliminar/Ver) would otherwise be clipped by the rounded container.
  // This lets the grid scroll horizontally instead of hiding them.
  return (
    <div
      ref={scrollerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onClickCapture={onClickCapture}
      className="border border-gray-200 rounded-lg overflow-x-auto select-none [scrollbar-width:thin] cursor-grab active:cursor-grabbing"
    >
      <table className="w-full min-w-[26rem] text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Módulo
            </th>
            {ACTIONS.map((action) => (
              <th
                key={action}
                className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {ACTION_LABELS[action]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.module}>
              <td className="px-3 py-2.5 text-gray-700 font-medium whitespace-nowrap">
                {row.label}
              </td>
              {ACTIONS.map((action) => {
                const permName = row.actions[action];
                if (permName === undefined) {
                  // This action doesn't exist for this module.
                  return <td key={action} className="px-3 py-2.5" />;
                }
                const isOn = selected.has(permName);

                return (
                  <td key={action} className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isOn}
                      aria-label={`${ACTION_LABELS[action]} ${row.label}`}
                      disabled={readOnly}
                      onClick={() => onToggle?.(permName)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        isOn ? 'bg-blue-600' : 'bg-gray-200'
                      } ${readOnly ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          isOn ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
