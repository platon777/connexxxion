/**
 * Xano Realtime WebSocket Connection
 * Uses Xano SDK for proper WebSocket-based realtime communication
 */
import { XanoClient } from '@xano/js-sdk';
import { API_FALLBACK_HOST } from './client';

type RealtimeMessageHandler = (data: unknown) => void | Promise<void>;

// Xano instance base URL
const INSTANCE_BASE_URL = API_FALLBACK_HOST;

// Realtime connection hash from Xano Dashboard -> Realtime -> Settings
const REALTIME_CONNECTION_HASH = 'tKi3HqCgJSGS8TLdG9EMHmEuGMQ';

let xanoClient: XanoClient | null = null;

/**
 * Initialize Xano client for realtime (singleton)
 */
const getXanoClient = () => {
  if (!xanoClient && REALTIME_CONNECTION_HASH) {
    xanoClient = new XanoClient({
      instanceBaseUrl: INSTANCE_BASE_URL,
      realtimeConnectionHash: REALTIME_CONNECTION_HASH,
    });
  }
  return xanoClient;
};

/**
 * Set auth token for realtime connection
 */
export const setRealtimeAuthToken = (token: string) => {
  const client = getXanoClient();
  if (client) {
    client.setRealtimeAuthToken(token);
  }
};

/**
 * Subscribe to a Xano realtime channel
 */
export const subscribeToRealtimeChannel = (
  channelName: string,
  handler: RealtimeMessageHandler
) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Check if realtime is configured (should always be true now)
  if (!REALTIME_CONNECTION_HASH) {
    console.error('Xano Realtime hash is missing');
    return () => {};
  }

  const client = getXanoClient();
  if (!client) {
    console.error('Failed to initialize Xano client');
    return () => {};
  }

  // Create channel
  const channel = client.channel(channelName);

  // Listen for messages
  channel.on((message) => {
    // Xano sends messages with action and payload structure
    if (message && typeof message === 'object') {
      const msgObj = message as { action?: string; payload?: unknown };

      // Handle broadcast messages
      if (msgObj.action === 'message' || msgObj.action === 'broadcast') {
        void handler(msgObj.payload);
      } else {
        // For other message types, pass the whole message
        void handler(message);
      }
    } else {
      void handler(message);
    }
  });

  // Return cleanup function
  return () => {
    // Xano SDK handles cleanup automatically when channel goes out of scope
    // But we can add explicit cleanup if needed in the future
  };
};
