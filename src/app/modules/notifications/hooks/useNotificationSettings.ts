import { useState } from 'react';

export function useNotificationSettings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [systemEnabled, setSystemEnabled] = useState(true);
  const [sendTime, setSendTime] = useState('07:00');
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4]);
  const [saved, setSaved] = useState(false);

  const toggleDay = (index: number) => {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index],
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return {
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
  };
}
