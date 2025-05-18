import { useEffect } from "react";
import io from "socket.io-client";

const WebSocketComponent = ({ onNewRecording }) => {
  useEffect(() => {
    const socket = io();

    socket.on("newRecording", () => {
      onNewRecording();
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewRecording]);

  return null;
};

export default WebSocketComponent;
