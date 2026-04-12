import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
          setIsConnected(true);
          setError(null);
          console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            setData(parsedData);
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.current.onclose = () => {
          setIsConnected(false);
          console.log('WebSocket disconnected');
          
          // Attempt to reconnect after 3 seconds
          setTimeout(() => {
            if (ws.current?.readyState === WebSocket.CLOSED) {
              connectWebSocket();
            }
          }, 3000);
        };

        ws.current.onerror = (error) => {
          setError(error);
          setIsConnected(false);
          console.error('WebSocket error:', error);
        };
      } catch (err) {
        setError(err);
        console.error('Failed to create WebSocket connection:', err);
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [url]);

  return { data, isConnected, error };
};
