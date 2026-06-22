import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useRescheduleQueue } from '../hooks/useRescheduleQueue';
import { RescheduleQueueTable, RescheduleAppointmentModal } from '../components';
import type { PendingReschedule } from '../types/holidays.types';

// Dedicated page listing only the appointments that need rescheduling after a
// holiday (HU-039, scenario 3). Reached from the "Reagendar todas" action.
export default function RescheduleQueuePage() {
  const navigate = useNavigate();
  const { queue, today, validateSlot, reschedule } = useRescheduleQueue();

  const [active, setActive] = useState<PendingReschedule | null>(null);

  const handleConfirm = (date: string, time: string) => {
    if (!active) return;
    const ok = reschedule(active, date, time);
    if (ok) setActive(null);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Citas por reagendar"
        subtitle="Citas afectadas por un día feriado que deben reprogramarse."
      >
        <button
          type="button"
          onClick={() => navigate('/institution-schedule')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al horario
        </button>
      </PageHeader>

      <RescheduleQueueTable appointments={queue} onReschedule={setActive} />

      {active && (
        <RescheduleAppointmentModal
          appointment={active}
          today={today}
          validateSlot={validateSlot}
          onCancel={() => setActive(null)}
          onConfirm={handleConfirm}
        />
      )}
    </PageContainer>
  );
}
