"use client";

import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

const WebSocketHandler: React.FC = ({}) => {
  const wssURL =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_DOMAIN!
      : process.env.NEXT_PUBLIC_WS_BASE_URL!;
  const WS_URL = `wss://${wssURL}/api/ws/ready`;
  const { readyState } = useWebSocket<any>(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    //attemptNumber will be 0 the first time it attempts to reconnect, so this equation results in a reconnect pattern of 1 second, 2 seconds, 4 seconds, 8 seconds, and then caps at 10 seconds until the maximum number of attempts is reached
    reconnectInterval: (attemptNumber) => {
      if (attemptNumber > 10) {
        console.log("Reloading Window");
        window.location.reload();
      }
      return Math.min(Math.pow(2, attemptNumber) * 1000, 10000);
    },
    heartbeat: {
      message: "ping",
      returnMessage: "pong",
      timeout: 60000, // 1 minute, if no response is received, the connection will be closed
      interval: 25000, // every 25 seconds, a ping message will be sent
    },
  });

  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed");
  }, [readyState]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch("/api/heartbeat", {
          method: "POST",
        });
      } catch (error) {
        console.error("Error sending heartbeat:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return <></>;
};

export default WebSocketHandler;
