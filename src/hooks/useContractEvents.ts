import { useState, useCallback } from 'react';
import { useContractEvents as useEvents, EventNotificationService } from '../services/eventListenerService';
import type { MintEvent, BurnEvent, SubscriptionEvent } from '../services/eventListenerService';

export function useContractEvents() {
  const [lastMint, setLastMint] = useState<MintEvent | null>(null);
  const [lastBurn, setLastBurn] = useState<BurnEvent | null>(null);
  const [lastSubscription, setLastSubscription] = useState<SubscriptionEvent | null>(null);

  const notificationService = EventNotificationService.getInstance();

  const handleMint = useCallback((event: MintEvent) => {
    setLastMint(event);
    notificationService.notify({
      type: 'mint',
      title: 'New ARI Minted!',
      message: `Token #${event.tokenId} has been minted`,
      data: event
    });
  }, []);

  const handleBurn = useCallback((event: BurnEvent) => {
    setLastBurn(event);
    notificationService.notify({
      type: 'burn',
      title: 'ARI Ghosted!',
      message: `Token #${event.tokenId} has been burned for ${event.moonstoneReward} moonstone`,
      data: event
    });
  }, []);

  const handleSubscription = useCallback((event: SubscriptionEvent) => {
    setLastSubscription(event);
    notificationService.notify({
      type: 'subscription',
      title: event.isTrial ? 'Trial Started!' : 'New Subscription!',
      message: `Subscription active until ${new Date(event.endTime * 1000).toLocaleDateString()}`,
      data: event
    });
  }, []);

  // Use the event listener service
  useEvents(handleMint, handleBurn, handleSubscription);

  return {
    lastMint,
    lastBurn,
    lastSubscription
  };
} 