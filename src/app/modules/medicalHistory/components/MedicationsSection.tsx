import { Pill, Plus, Trash2 } from 'lucide-react';
import type { Drug, MedError, MedItem } from '../types/medicalHistory.types';

interface MedicationsSectionProps {
  meds: MedItem[];
  medErrors: MedError[];
  drugs: Drug[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, patch: Partial<MedItem>) => void;
  onCatalogSelect: (index: number, drugId: string) => void;
}

// Presentational: state and mutations live in useHistoryEntryForm.
export default function MedicationsSection({
  meds,
  medErrors,
  drugs,
  onAdd,
  onRemove,
  onUpdate,
  onCatalogSelect,
}: MedicationsSectionProps) {
  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Pill className="w-4 h-4 text-gray-500" />
          Medicamentos indicados
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar medicamento
        </button>
      </div>

      {meds.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No se han agregado medicamentos.</p>
      ) : (
        <div className="space-y-3">
          {meds.map((med, index) => {
            const err = medErrors[index] || {};
            return (
              <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Medicamento {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Eliminar medicamento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Del catálogo <span className="font-normal">(opcional)</span>
                  </label>
                  <select
                    value={med.drug_id}
                    onChange={(e) => onCatalogSelect(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                  >
                    <option value="">— Seleccionar del catálogo —</option>
                    {drugs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nombre del medicamento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Amoxicilina 500mg"
                    value={med.drug_name}
                    onChange={(e) => onUpdate(index, { drug_name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${err.drug_name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  />
                  {err.drug_name && <p className="text-red-500 text-xs mt-1">{err.drug_name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dosis <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ej. 500mg"
                      value={med.dose}
                      onChange={(e) => onUpdate(index, { dose: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${err.dose ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    />
                    {err.dose && <p className="text-red-500 text-xs mt-1">{err.dose}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Frecuencia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ej. cada 8 horas"
                      value={med.frequency}
                      onChange={(e) => onUpdate(index, { frequency: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${err.frequency ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    />
                    {err.frequency && <p className="text-red-500 text-xs mt-1">{err.frequency}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
