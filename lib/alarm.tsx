import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { notificationsSupported } from './notifications';
import type { PrayerKey } from './prayer';

type AlarmData = {
  prayer: PrayerKey | string;
  title?: string;
  body?: string;
  time?: string;
} | null;

type AlarmCtx = {
  visible: boolean;
  data: AlarmData;
  show: (d?: AlarmData) => void;
  hide: () => void;
};

const Ctx = createContext<AlarmCtx>({
  visible: false,
  data: null,
  show: () => {},
  hide: () => {},
});

export function useAlarm() {
  return useContext(Ctx);
}

export function AlarmProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<AlarmData>(null);

  const show = (d?: AlarmData) => {
    setData(d || null);
    setVisible(true);
  };
  const hide = () => setVisible(false);

  useEffect(() => {
    if (!notificationsSupported) return;

    // فتح منبه لو ضغط على الإشعار
    const sub1 = Notifications.addNotificationResponseReceivedListener((response) => {
      const content = response.notification.request.content;
      const d: any = content.data || {};
      if (d.type === 'adhan' || d.prayer) {
        show({ prayer: d.prayer || 'fajr', title: content.title || undefined, body: content.body || undefined });
      } else {
        // حتى لو مفيش داتا، نعرض منبه عام
        show({ prayer: 'fajr', title: content.title || undefined, body: content.body || undefined });
      }
    });

    // لو الإشعار جه وهو التطبيق مفتوح
    const sub2 = Notifications.addNotificationReceivedListener((notification) => {
      const content = notification.request.content;
      const d: any = content.data || {};
      if (d.type === 'adhan' || d.prayer) {
        // نعرض منبه زجاجى مائى فورًا
        show({ prayer: d.prayer || 'fajr', title: content.title || undefined, body: content.body || undefined });
      }
    });

    // لو التطبيق رجع من الخلفية
    const sub3 = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        // ممكن نتحقق من إشعارات معلقة لو عايز، لكن العرض دلوقتى بيتم فوق
      }
    });

    return () => {
      sub1.remove();
      sub2.remove();
      sub3.remove();
    };
  }, []);

  return (
    <Ctx.Provider value={{ visible, data, show, hide }}>
      {children}
    </Ctx.Provider>
  );
}
