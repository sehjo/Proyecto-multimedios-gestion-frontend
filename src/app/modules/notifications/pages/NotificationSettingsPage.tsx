import PageContainer from '../../../components/PageContainer';
import PageHeader from '../../../components/PageHeader';
import { useNotificationSettings } from '../hooks/useNotificationSettings';
import {
  NotificationAdminBanner,
  NotificationChannelsCard,
  NotificationScheduleCard,
  NotificationQueueCard,
  NotificationChangeLog,
  NotificationStatusCard,
  NotificationsGrid,
} from '../components';

export default function NotificationSettingsPage() {
  const {
    emailEnabled,
    setEmailEnabled,
    systemEnabled,
    setSystemEnabled,
    sendTime,
    setSendTime,
    selectedDays,
    toggleDay,
    saved,
    handleSave,
  } = useNotificationSettings();

  return (
    <PageContainer>
      <PageHeader
        title="Configuración de Notificaciones"
        subtitle="Gestione los canales de notificación y los horarios de envío de recordatorios diarios"
      />

      <NotificationAdminBanner />

      <NotificationsGrid
        main={
          <>
            <NotificationChannelsCard
              emailEnabled={emailEnabled}
              systemEnabled={systemEnabled}
              onToggleEmail={() => setEmailEnabled((v) => !v)}
              onToggleSystem={() => setSystemEnabled((v) => !v)}
            />
            <NotificationScheduleCard
              sendTime={sendTime}
              selectedDays={selectedDays}
              saved={saved}
              onTimeChange={setSendTime}
              onToggleDay={toggleDay}
              onSave={handleSave}
            />
            <NotificationQueueCard />
          </>
        }
        side={
          <>
            <NotificationChangeLog />
            <NotificationStatusCard
              emailEnabled={emailEnabled}
              systemEnabled={systemEnabled}
              sendTime={sendTime}
              selectedDays={selectedDays}
            />
          </>
        }
      />
    </PageContainer>
  );
}
