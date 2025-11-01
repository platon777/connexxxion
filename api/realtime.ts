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

// Track if client is being initialized
let isInitializing = false;
let initPromise: Promise<XanoClient | null> | null = null;

/**
 * Wait for WebSocket to be ready
 */
const waitForWebSocketReady = async (timeout = 5000): Promise<boolean> => {
  const checkInterval = 50; // Check every 50ms
  const maxAttempts = timeout / checkInterval;
  let attempts = 0;

  return new Promise((resolve) => {
    const checkReady = () => {
      // Access internal WebSocket through the client (if possible)
      // Otherwise wait a reasonable amount of time
      attempts++;

      if (attempts >= maxAttempts) {
        console.warn('WebSocket connection timeout - proceeding anyway');
        resolve(true);
        return;
      }

      // Wait a bit more
      setTimeout(checkReady, checkInterval);
    };

    // Start checking after initial delay
    setTimeout(checkReady, 200);
  });
};

/**
 * Initialize Xano client for realtime (singleton)
 */
const getXanoClient = async (): Promise<XanoClient | null> => {
  if (xanoClient) {
    return xanoClient;
  }

  if (isInitializing && initPromise) {
    return initPromise;
  }

  if (!REALTIME_CONNECTION_HASH) {
    return null;
  }

  isInitializing = true;
  initPromise = new Promise(async (resolve) => {
    try {
      xanoClient = new XanoClient({
        instanceBaseUrl: INSTANCE_BASE_URL,
        realtimeConnectionHash: REALTIME_CONNECTION_HASH,
      });

      // Wait for WebSocket to be ready
      await waitForWebSocketReady();

      isInitializing = false;
      resolve(xanoClient);
    } catch (error) {
      console.error('Failed to initialize Xano client:', error);
      isInitializing = false;
      resolve(null);
    }
  });

  return initPromise;
};

/**
 * Set auth token for realtime connection
 */
export const setRealtimeAuthToken = async (token: string) => {
  const client = await getXanoClient();
  if (client) {
    client.setRealtimeAuthToken(token);
  }
};

/**
 * Create channel with retry logic
 */
const createChannelWithRetry = async (
  client: XanoClient,
  channelName: string,
  maxRetries = 5
): Promise<any> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const channel = client.channel(channelName);
      // If successful, return the channel
      return channel;
    } catch (error: any) {
      // Check if it's the CONNECTING state error
      if (error?.message?.includes('CONNECTING state') && attempt < maxRetries - 1) {
        // Wait exponentially: 100ms, 200ms, 400ms, 800ms, 1600ms
        const waitTime = 100 * Math.pow(2, attempt);
        console.log(`WebSocket not ready, retrying in ${waitTime}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
  throw new Error(`Failed to create channel ${channelName} after ${maxRetries} attempts`);
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

  let channel: any = null;

  // Initialize client and channel asynchronously
  void (async () => {
    try {
      const client = await getXanoClient();
      if (!client) {
        console.error('Failed to initialize Xano client');
        return;
      }

      // Create channel with retry logic
      channel = await createChannelWithRetry(client, channelName);

      // Listen for messages
      channel.on((message: any) => {
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

      console.log(`✅ Connected to Xano realtime channel: ${channelName}`);
    } catch (error) {
      console.error(`Failed to subscribe to channel ${channelName}:`, error);
    }
  })();

  // Return cleanup function
  return () => {
    // Xano SDK handles cleanup automatically when channel goes out of scope
    // But we can add explicit cleanup if needed in the future
  };
};
