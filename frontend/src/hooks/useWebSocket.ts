import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export function useWebSocket(url: string, options: { onMessage?: (message: WebSocketMessage) => void; autoReconnect?: boolean } = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<any>();

  const connect = () => {
    try {
      ws.current = new WebSocket(url);
      ws.current.onopen = () => { setIsConnected(true); };
      ws.current.onclose = () => {
        setIsConnected(false);
        if (options.autoReconnect !== false) {
          reconnectTimeout.current = setTimeout(() => connect(), 3000);
        }
      };
      ws.current.onerror = (error) => { console.error('WebSocket error:', error); };
      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          options.onMessage?.(message);
        } catch (e) { console.error('Failed to parse WebSocket message:', e); }
      };
    } catch (error) { console.error('WebSocket connection failed:', error); }
  };

  const sendMessage = (type: string, data: any) => {
    if (ws.current && isConnected) {
      const message: WebSocketMessage = { type, data, timestamp: Date.now() };
      ws.current.send(JSON.stringify(message));
    }
  };

  const disconnect = () => {
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    if (ws.current) ws.current.close();
  };

  useEffect(() => { connect(); return () => { disconnect(); }; }, [url]);

  return { isConnected, lastMessage, sendMessage, disconnect, reconnect: connect };
}
