import React, { useEffect, useRef } from 'react';
import { useThingSpeakContext } from '../context/ThingSpeakContext';

/**
 * AlertToastManager — invisible component mounted at the app root.
 * It monitors ThingSpeak context and fires toast notifications on threshold breaches.
 * All toast firing is handled inside ThingSpeakContext itself (via fireToast).
 * This component handles the *backend alert trigger* side-effect.
 */
export function AlertToastManager() {
  const { activeAlerts, triggerBackendAlert } = useThingSpeakContext();
  const lastTriggeredRef = useRef<Record<string, number>>({});

  useEffect(() => {
    // Backend buzzer trigger for critical alerts (debounced per alert type)
    const now = Date.now();
    activeAlerts.forEach((alert: any) => {
      if (alert.severity === 'critical') {
        const lastTriggered = lastTriggeredRef.current[alert.id] || 0;
        if (now - lastTriggered > 60000) { // 1 minute debounce for backend
          lastTriggeredRef.current[alert.id] = now;
          triggerBackendAlert({
            type: alert.type,
            value: alert.value,
            threshold: alert.threshold,
            timestamp: alert.timestamp,
          });
        }
      }
    });
  }, [activeAlerts, triggerBackendAlert]);

  // This is a side-effect-only component; no UI rendered
  return null;
}
