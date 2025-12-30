
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getMarketSocket() {
    if(!socket) {
        socket = io('http://localhost:4000', {
            transports: ["websocket"],
            autoConnect: true
        });
    }
    return socket;
}