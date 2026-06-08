export const MOCK_CURRENT_USER = {
  id: 1,
  name: 'Ricardo',
  lastname: 'Solano',
  role: 'doctor' as 'doctor' | 'admin' | 'nurse',
};

export const MOCK_PATIENTS = [
  { id: 1, name: 'Carlos', lastname: 'Méndez', nick: 'Carlitos' },
  { id: 2, name: 'María', lastname: 'González', nick: 'Marta' },
  { id: 3, name: 'Luis', lastname: 'Herrera', nick: 'Lucho' },
  { id: 4, name: 'Ana', lastname: 'Vargas', nick: 'Anita' },
  { id: 5, name: 'Jorge', lastname: 'Ramírez', nick: 'Jordi' },
];

export const MOCK_USERS = [
  { id: 1, name: 'Ricardo', lastname: 'Solano' },
  { id: 2, name: 'Elena', lastname: 'Mora' },
  { id: 3, name: 'Andrés', lastname: 'Castro' },
];

export const MOCK_DISEASES = [
  { id: 1, name: 'Hipertensión arterial' },
  { id: 2, name: 'Diabetes mellitus tipo 2' },
  { id: 3, name: 'Asma bronquial' },
  { id: 4, name: 'Gastritis crónica' },
  { id: 5, name: 'Rinitis alérgica' },
  { id: 6, name: 'Lumbago' },
];

export const MOCK_DRUGS = [
  { id: 1, name: 'Enalapril 10mg' },
  { id: 2, name: 'Metformina 850mg' },
  { id: 3, name: 'Salbutamol inhalador' },
  { id: 4, name: 'Omeprazol 20mg' },
  { id: 5, name: 'Loratadina 10mg' },
  { id: 6, name: 'Ibuprofeno 600mg' },
  { id: 7, name: 'Paracetamol 500mg' },
  { id: 8, name: 'Amoxicilina 500mg' },
];

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'rescheduled';

export const MOCK_DOCTORS = [
  { id: 1, name: 'Ricardo', lastname: 'Solano', specialty: 'Cardiología' },
  { id: 2, name: 'Elena', lastname: 'Mora', specialty: 'Pediatría' },
  { id: 3, name: 'Andrés', lastname: 'Castro', specialty: 'Medicina General' },
];

export const MOCK_APPOINTMENTS: {
  id: number;
  patient_id: number;
  doctor_id: number;
  specialty: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string;
  cancellation_reason?: string;
  attended_at?: string;
}[] = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 1,
    specialty: 'Cardiología',
    appointment_date: '2026-06-09',
    appointment_time: '07:00',
    status: 'confirmed',
    notes: 'Control mensual de presión arterial',
  },
  {
    id: 2,
    patient_id: 2,
    doctor_id: 1,
    specialty: 'Cardiología',
    appointment_date: '2026-06-09',
    appointment_time: '07:30',
    status: 'pending',
    notes: '',
  },
  {
    id: 3,
    patient_id: 5,
    doctor_id: 1,
    specialty: 'Cardiología',
    appointment_date: '2026-06-09',
    appointment_time: '08:30',
    status: 'pending',
    notes: 'Paciente refiere palpitaciones frecuentes',
  },
  {
    id: 4,
    patient_id: 3,
    doctor_id: 2,
    specialty: 'Pediatría',
    appointment_date: '2026-06-10',
    appointment_time: '09:00',
    status: 'confirmed',
    notes: '',
  },
  {
    id: 5,
    patient_id: 4,
    doctor_id: 2,
    specialty: 'Pediatría',
    appointment_date: '2026-06-10',
    appointment_time: '09:30',
    status: 'cancelled',
    notes: 'Paciente canceló por enfermedad',
  },
  {
    id: 6,
    patient_id: 1,
    doctor_id: 3,
    specialty: 'Medicina General',
    appointment_date: '2026-06-09',
    appointment_time: '10:00',
    status: 'attended',
    notes: '',
  },
  {
    id: 7,
    patient_id: 2,
    doctor_id: 3,
    specialty: 'Medicina General',
    appointment_date: '2026-06-09',
    appointment_time: '10:30',
    status: 'confirmed',
    notes: 'Seguimiento post-operatorio',
  },
  {
    id: 8,
    patient_id: 5,
    doctor_id: 2,
    specialty: 'Pediatría',
    appointment_date: '2026-06-12',
    appointment_time: '08:00',
    status: 'pending',
    notes: '',
  },
  {
    id: 9,
    patient_id: 3,
    doctor_id: 1,
    specialty: 'Cardiología',
    appointment_date: '2026-06-11',
    appointment_time: '09:00',
    status: 'confirmed',
    notes: 'Electrocardiograma de control',
  },
  {
    id: 10,
    patient_id: 4,
    doctor_id: 3,
    specialty: 'Medicina General',
    appointment_date: '2026-06-13',
    appointment_time: '08:00',
    status: 'pending',
    notes: '',
  },
];

export type HistoryEntry = {
  id: number;
  patient_id: number;
  consultation_date: string;
  doctor_id: number;
  diagnosis: string;
  disease_id: number | null;
  treatment: string;
  observations: string;
  updated_at?: string;
  medications?: Array<{
    id: number;
    drug_id: number | null;
    drug_name: string;
    dose: string;
    frequency: string;
  }>;
};

export const MOCK_HISTORY_ENTRIES: Array<{
  id: number;
  patient_id: number;
  consultation_date: string;
  doctor_id: number;
  diagnosis: string;
  disease_id: number | null;
  treatment: string;
  observations: string;
  updated_at?: string;
  medications?: Array<{
    id: number;
    drug_id: number | null;
    drug_name: string;
    dose: string;
    frequency: string;
  }>;
}> = [
  // Carlos Méndez (patient_id: 1)
  {
    id: 1,
    patient_id: 1,
    consultation_date: '2024-06-10T14:00:00Z',
    doctor_id: 1,
    diagnosis: 'Lumbalgia mecánica con contractura muscular paravertebral bilateral',
    disease_id: 6,
    treatment: 'Reposo relativo 48 horas, aplicación de calor local 20 minutos 3 veces al día. Fisioterapia 2 veces por semana por 4 semanas.',
    observations: 'Paciente refiere dolor intenso al flexionar el tronco. Limitación funcional moderada. Se indica control en 2 semanas.',
    medications: [
      { id: 1, drug_id: 6, drug_name: 'Ibuprofeno 600mg', dose: '600mg', frequency: 'Cada 8 horas por 5 días con alimentos' },
      { id: 2, drug_id: 7, drug_name: 'Paracetamol 500mg', dose: '500mg', frequency: 'Cada 6 horas si persiste el dolor' },
    ],
  },
  {
    id: 2,
    patient_id: 1,
    consultation_date: '2024-03-20T09:00:00Z',
    doctor_id: 2,
    diagnosis: 'Diabetes mellitus tipo 2 con glucemia en ayunas de 180 mg/dL',
    disease_id: 2,
    treatment: 'Dieta hipocalórica con restricción de azúcares simples. Ejercicio aeróbico 30 minutos diarios. Control de glucemia capilar en casa.',
    observations: 'HbA1c pendiente. Paciente con escasa adherencia al régimen alimentario. Se refuerza educación diabetológica.',
    medications: [
      { id: 1, drug_id: 2, drug_name: 'Metformina 850mg', dose: '850mg', frequency: '1 tableta con el almuerzo y 1 con la cena' },
    ],
  },
  {
    id: 3,
    patient_id: 1,
    consultation_date: '2024-01-15T10:30:00Z',
    doctor_id: 1,
    diagnosis: 'Hipertensión arterial estadio 1 con presión sistólica de 145/90 mmHg',
    disease_id: 1,
    treatment: 'Restricción de sodio a menos de 2 g/día. Actividad física moderada 5 días a la semana. Evitar cafeína y tabaco.',
    observations: 'Primer diagnóstico de hipertensión. Paciente asintomático. Antecedentes familiares positivos. Se inicia manejo no farmacológico.',
    medications: [
      { id: 1, drug_id: 1, drug_name: 'Enalapril 10mg', dose: '10mg', frequency: '1 vez al día en la mañana' },
    ],
  },
  // María González (patient_id: 2)
  {
    id: 4,
    patient_id: 2,
    consultation_date: '2024-05-18T16:30:00Z',
    doctor_id: 2,
    diagnosis: 'Gastritis crónica por estrés laboral con epigastralgia postprandial',
    disease_id: 4,
    treatment: 'Dieta blanda fraccionada en 5 comidas pequeñas. Evitar picantes, café y alcohol. Técnicas de relajación.',
    observations: 'Ardor epigástrico frecuente relacionado con estrés. Endoscopia pendiente si síntomas persisten 30 días.',
    medications: [
      { id: 1, drug_id: 4, drug_name: 'Omeprazol 20mg', dose: '20mg', frequency: '1 vez al día en ayunas por 30 días' },
    ],
  },
  {
    id: 5,
    patient_id: 2,
    consultation_date: '2024-02-05T11:00:00Z',
    doctor_id: 3,
    diagnosis: 'Asma bronquial persistente moderada con espirometría alterada',
    disease_id: 3,
    treatment: 'Evitar desencadenantes alérgicos (polvo, humo, mascotas). Técnica inhalatoria correcta demostrada.',
    observations: 'FEV1 72% del valor predicho. Crisis nocturnas 2 veces por semana. Se ajusta terapia de mantenimiento.',
    medications: [
      { id: 1, drug_id: 3, drug_name: 'Salbutamol inhalador', dose: '2 inhalaciones', frequency: 'Cada 6 horas o según necesidad durante la crisis' },
    ],
  },
  // Luis Herrera (patient_id: 3)
  {
    id: 6,
    patient_id: 3,
    consultation_date: '2024-04-01T08:45:00Z',
    doctor_id: 1,
    diagnosis: 'Rinitis alérgica estacional con sensibilización a pólenes y ácaros',
    disease_id: 5,
    treatment: 'Lavados nasales con suero fisiológico 2 veces al día. Uso de cubrebocas en exteriores durante polinización.',
    observations: 'Prueba cutánea positiva para ácaros del polvo y gramíneas. Se recomienda higiene ambiental.',
    medications: [
      { id: 1, drug_id: 5, drug_name: 'Loratadina 10mg', dose: '10mg', frequency: '1 vez al día por la noche durante 30 días' },
    ],
  },
  // Ana Vargas (patient_id: 4) — sin entradas para mostrar estado vacío
  // Jorge Ramírez (patient_id: 5)
  {
    id: 7,
    patient_id: 5,
    consultation_date: '2024-06-01T11:00:00Z',
    doctor_id: 2,
    diagnosis: 'Gastritis crónica con epigastralgia de 3 meses de evolución',
    disease_id: 4,
    treatment: 'Dieta blanda, 5 comidas pequeñas al día. Evitar AINES y alcohol. Elevar cabecera de cama 30°.',
    observations: 'Síntomas relacionados con ingesta de antiinflamatorios por dolor articular. Se suspende AINE.',
    medications: [
      { id: 1, drug_id: 4, drug_name: 'Omeprazol 20mg', dose: '20mg', frequency: '1 vez al día en ayunas' },
      { id: 2, drug_id: 8, drug_name: 'Amoxicilina 500mg', dose: '500mg', frequency: 'Cada 8 horas por 10 días' },
    ],
  },
  {
    id: 8,
    patient_id: 5,
    consultation_date: '2024-03-15T09:30:00Z',
    doctor_id: 1,
    diagnosis: 'Lumbalgia crónica con hernia discal L4-L5 confirmada por resonancia magnética',
    disease_id: 6,
    treatment: 'Fisioterapia 3 veces por semana por 8 semanas. Ejercicios de fortalecimiento de core. Evitar cargas superiores a 5 kg.',
    observations: 'RM muestra hernia discal L4-L5 con compresión radicular leve. Sin déficit neurológico. Valorar cirugía si no mejora en 3 meses.',
    medications: [
      { id: 1, drug_id: 6, drug_name: 'Ibuprofeno 600mg', dose: '600mg', frequency: 'Cada 8 horas por 7 días con alimentos' },
    ],
  },
  {
    id: 9,
    patient_id: 5,
    consultation_date: '2024-01-25T12:00:00Z',
    doctor_id: 3,
    diagnosis: 'Diabetes mellitus tipo 2 de diagnóstico reciente con glucemia de 210 mg/dL',
    disease_id: 2,
    treatment: 'Dieta con índice glucémico bajo, eliminación de azúcares refinados. Caminata 30 minutos post-comida.',
    observations: 'Diagnóstico incidental. Antecedentes familiares de diabetes (madre y hermano). Inicio de educación diabetológica.',
    medications: [
      { id: 1, drug_id: 2, drug_name: 'Metformina 850mg', dose: '850mg', frequency: '1 tableta antes del almuerzo y antes de cenar' },
    ],
  },
  {
    id: 10,
    patient_id: 5,
    consultation_date: '2023-11-10T10:00:00Z',
    doctor_id: 2,
    diagnosis: 'Hipertensión arterial estadio 1 detectada en control de rutina',
    disease_id: 1,
    treatment: 'Dieta DASH (baja en sodio y grasa saturada). Reducción de peso corporal. Actividad aeróbica 150 minutos semanales.',
    observations: 'Hipertensión de reciente diagnóstico en paciente joven. Ecocardiograma y perfil renal solicitados. Control en 6 semanas.',
    medications: [
      { id: 1, drug_id: 1, drug_name: 'Enalapril 10mg', dose: '10mg', frequency: 'Cada 24 horas, monitorear presión semanalmente' },
    ],
  },
];
