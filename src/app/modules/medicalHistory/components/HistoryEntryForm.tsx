import MedicationsSection from './MedicationsSection';
import type {
  Disease,
  Drug,
  HistoryEntryPayload,
  HistoryFormErrors,
  MedError,
  MedItem,
} from '../types/medicalHistory.types';

interface HistoryEntryFormProps {
  formData: HistoryEntryPayload;
  errors: HistoryFormErrors;
  doctorLabel: string;
  diseases: Disease[];
  onFieldChange: (field: keyof HistoryEntryPayload, value: string) => void;
  onDiseaseSelect: (diseaseId: string) => void;
  meds: MedItem[];
  medErrors: MedError[];
  drugs: Drug[];
  onAddMed: () => void;
  onRemoveMed: (index: number) => void;
  onUpdateMed: (index: number, patch: Partial<MedItem>) => void;
  onCatalogSelect: (index: number, drugId: string) => void;
}

// Shared fields rendered by HistoryEntryFormModal in both create and edit mode.
export default function HistoryEntryForm({
  formData,
  errors,
  doctorLabel,
  diseases,
  onFieldChange,
  onDiseaseSelect,
  meds,
  medErrors,
  drugs,
  onAddMed,
  onRemoveMed,
  onUpdateMed,
  onCatalogSelect,
}: HistoryEntryFormProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de consulta <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.consultation_date}
          onChange={(e) => onFieldChange('consultation_date', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.consultation_date ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
        {errors.consultation_date && <p className="text-red-500 text-xs mt-1">{errors.consultation_date}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Médico tratante <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={doctorLabel}
          readOnly
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Seleccionar enfermedad del catálogo <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <select
          value={formData.disease_id}
          onChange={(e) => onDiseaseSelect(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
        >
          <option value="">— Seleccionar del catálogo —</option>
          {diseases.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">Al seleccionar, el nombre se carga automáticamente en el campo de diagnóstico.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Diagnóstico <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(máx. 500 caracteres)</span>
        </label>
        <textarea
          rows={3}
          maxLength={500}
          placeholder="Describa el diagnóstico de la consulta..."
          value={formData.diagnosis}
          onChange={(e) => onFieldChange('diagnosis', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.diagnosis ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
        <div className="flex justify-between mt-1">
          {errors.diagnosis ? <p className="text-red-500 text-xs">{errors.diagnosis}</p> : <span />}
          <span className={`text-xs ${formData.diagnosis.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
            {formData.diagnosis.length}/500
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tratamiento indicado <span className="text-gray-400 font-normal">(máx. 500 caracteres)</span>
        </label>
        <textarea
          rows={3}
          maxLength={500}
          placeholder="Describa el tratamiento indicado al paciente..."
          value={formData.treatment}
          onChange={(e) => onFieldChange('treatment', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="text-right mt-1">
          <span className={`text-xs ${formData.treatment.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
            {formData.treatment.length}/500
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones <span className="text-gray-400 font-normal">(máx. 1000 caracteres)</span>
        </label>
        <textarea
          rows={4}
          maxLength={1000}
          placeholder="Observaciones adicionales de la consulta..."
          value={formData.observations}
          onChange={(e) => onFieldChange('observations', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="text-right mt-1">
          <span className={`text-xs ${formData.observations.length >= 1000 ? 'text-red-500' : 'text-gray-400'}`}>
            {formData.observations.length}/1000
          </span>
        </div>
      </div>

      <MedicationsSection
        meds={meds}
        medErrors={medErrors}
        drugs={drugs}
        onAdd={onAddMed}
        onRemove={onRemoveMed}
        onUpdate={onUpdateMed}
        onCatalogSelect={onCatalogSelect}
      />
    </>
  );
}
