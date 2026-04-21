import { useState, useEffect, useRef, useCallback } from 'react';

// ── ThingSpeak Field Mapping ──
// field1 → Temperature (°C)
// field2 → Humidity (%)
// field3 → Gas Value (Spoilage detection)
// field4 → Latitude
// field5 → Longitude

export interface ThingSpeakData {
  temperature: number;
  humidity: number;
  gas: number;
  lat: number;
  lon: number;
  timestamp: string;
}

export interface ThingSpeakState {
  data: ThingSpeakData | null;
  history: ThingSpeakData[];
  coordHistory: [number, number][];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isConnected: boolean;
}

const CHANNEL_ID = import.meta.env.VITE_THINGSPEAK_CHANNEL_ID || '3342325';
const API_KEY = import.meta.env.VITE_THINGSPEAK_API_KEY || '';
const POLL_INTERVAL = 5000; // 5 seconds
const MAX_HISTORY = 50;
const MAX_COORDS = 100;

function buildUrl(): string {
  let url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?results=1`;
  if (API_KEY) url += `&api_key=${API_KEY}`;
  return url;
}

function parseFeed(feed: any): ThingSpeakData | null {
  if (!feed) return null;
  
  const temperature = parseFloat(feed.field1);
  const humidity = parseFloat(feed.field2);
  const gas = parseFloat(feed.field3);
  const lat = parseFloat(feed.field4);
  const lon = parseFloat(feed.field5);
  
  // Validate at least temperature and humidity exist
  if (isNaN(temperature) && isNaN(humidity)) return null;

  return {
    temperature: isNaN(temperature) ? 0 : temperature,
    humidity: isNaN(humidity) ? 0 : humidity,
    gas: isNaN(gas) ? 0 : gas,
    lat: isNaN(lat) ? 0 : lat,
    lon: isNaN(lon) ? 0 : lon,
    timestamp: feed.created_at || new Date().toISOString(),
  };
}

export function useThingSpeak(): ThingSpeakState {
  const [data, setData] = useState<ThingSpeakData | null>(null);
  const [history, setHistory] = useState<ThingSpeakData[]>([]);
  const [coordHistory, setCoordHistory] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Track last timestamp to avoid duplicate entries
  const lastTimestampRef = useRef<string>('');
  const retryCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(buildUrl());
      
      if (!response.ok) {
        throw new Error(`ThingSpeak API error: ${response.status}`);
      }

      const json = await response.json();
      const feeds = json?.feeds;
      
      if (!feeds || feeds.length === 0) {
        // No data yet — not an error, just waiting
        setIsConnected(true);
        setLoading(false);
        return;
      }

      const latestFeed = feeds[feeds.length - 1];
      const parsed = parseFeed(latestFeed);

      if (!parsed) {
        setLoading(false);
        return;
      }

      // Only append to history if timestamp is new
      const isNewReading = parsed.timestamp !== lastTimestampRef.current;
      lastTimestampRef.current = parsed.timestamp;

      setData(parsed);
      setLastUpdated(new Date());
      setIsConnected(true);
      setError(null);
      retryCountRef.current = 0;

      if (isNewReading) {
        setHistory(prev => {
          const updated = [...prev, parsed];
          return updated.length > MAX_HISTORY ? updated.slice(-MAX_HISTORY) : updated;
        });

        // Append GPS coords only if valid
        if (parsed.lat !== 0 && parsed.lon !== 0) {
          setCoordHistory(prev => {
            const updated: [number, number][] = [...prev, [parsed.lat, parsed.lon]];
            return updated.length > MAX_COORDS ? updated.slice(-MAX_COORDS) : updated;
          });
        }
      }
    } catch (err: any) {
      retryCountRef.current += 1;
      setError(err.message || 'Failed to fetch ThingSpeak data');
      setIsConnected(false);

      // After 3 consecutive failures, slow down polling
      if (retryCountRef.current > 3) {
        console.warn('[ThingSpeak] Multiple failures, will continue retrying...');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Poll every 5 seconds
    const interval = setInterval(fetchData, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    history,
    coordHistory,
    loading,
    error,
    lastUpdated,
    isConnected,
  };
}
