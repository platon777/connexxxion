/**
 * Device ID management for anonymous likes
 * Generates and stores a unique device identifier in localStorage
 */

const DEVICE_ID_KEY = 'connexxion_device_id';
const DEVICE_IP_KEY = 'connexxion_device_ip';
const DEFAULT_IP_ENDPOINT = 'https://api.ipify.org?format=json';

const hashUserAgent = (userAgent: string): string => {
  let hash = 0;
  for (let i = 0; i < userAgent.length; i += 1) {
    hash = (hash + userAgent.charCodeAt(i)) >>> 0;
  }
  return Math.abs(hash).toString(16).slice(-6).padStart(6, '0');
};

const resolveIpAddress = async (): Promise<string> => {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const cachedIp = localStorage.getItem(DEVICE_IP_KEY);
  if (cachedIp) {
    return cachedIp;
  }

  const endpoint = import.meta.env.VITE_IP_ENDPOINT || DEFAULT_IP_ENDPOINT;

  try {
    const response = await fetch(endpoint, { credentials: 'omit' });
    if (!response.ok) {
      throw new Error(`Failed to fetch IP: ${response.status}`);
    }
    const rawText = await response.text();
    let ip = 'unknown';
    try {
      const parsed = JSON.parse(rawText);
      ip = parsed?.ip ?? 'unknown';
    } catch {
      ip = rawText?.trim() || 'unknown';
    }
    localStorage.setItem(DEVICE_IP_KEY, ip);
    return ip;
  } catch (error) {
    console.warn('Unable to resolve IP address for device id generation:', error);
    return 'unknown';
  }
};

export const getDeviceId = async (): Promise<string> => {
  if (typeof window === 'undefined') {
    return 'server_device';
  }

  const cached = localStorage.getItem(DEVICE_ID_KEY);
  if (cached) {
    return cached;
  }

  const userAgent = window.navigator?.userAgent ?? 'unknown-agent';
  const deviceHash = hashUserAgent(userAgent);
  const ip = await resolveIpAddress();
  const uniqueId = `${ip}_${deviceHash}`;

  localStorage.setItem(DEVICE_ID_KEY, uniqueId);
  return uniqueId;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'à l\'instant';
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heures`;
  if (diffInSeconds < 2592000) return `il y a ${Math.floor(diffInSeconds / 86400)} jours`;
  if (diffInSeconds < 31536000) return `il y a ${Math.floor(diffInSeconds / 2592000)} mois`;
  return `il y a ${Math.floor(diffInSeconds / 31536000)} ans`;
};
