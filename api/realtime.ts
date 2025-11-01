import { API_FALLBACK_HOST } from './client';

type RealtimeMessageHandler = (data: unknown) => void | Promise<void>;

const DEFAULT_REALTIME_BASE =
  import.meta.env.VITE_REALTIME_BASE_URL || `${API_FALLBACK_HOST}/realtime`;

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

export const subscribeToRealtimeChannel = (channel: string, handler: RealtimeMessageHandler) => {
  if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
    return () => {};
  }

  const baseUrl = normalizeBaseUrl(DEFAULT_REALTIME_BASE);
  const channelUrl = `${baseUrl}/${channel}`;

  let eventSource: EventSource | null = null;
  let closed = false;
  let reconnectTimeout: number | undefined;

  const connect = () => {
    if (closed) return;

    eventSource = new EventSource(channelUrl);

    eventSource.onmessage = async (event) => {
      if (!event?.data) return;
      try {
        const payload = JSON.parse(event.data);
        await handler(payload);
      } catch (error) {
        console.warn(`Failed to handle realtime event on channel ${channel}:`, error);
      }
    };

    eventSource.onerror = () => {
      if (eventSource) {
        eventSource.close();
      }
      if (!closed) {
        reconnectTimeout = window.setTimeout(connect, 5000);
      }
    };
  };

  connect();

  return () => {
    closed = true;
    if (reconnectTimeout) {
      window.clearTimeout(reconnectTimeout);
    }
    if (eventSource) {
      eventSource.close();
    }
  };
};
