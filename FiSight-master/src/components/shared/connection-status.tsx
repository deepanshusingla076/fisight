'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';

export function ConnectionStatus() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <Alert className="m-4 border-orange-200 bg-orange-50 text-orange-800">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You're currently offline. Some features may not work properly until you reconnect.
      </AlertDescription>
    </Alert>
  );
}
