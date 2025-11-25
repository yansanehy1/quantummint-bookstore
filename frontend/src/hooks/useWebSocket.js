"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebSocket = useWebSocket;
const react_1 = require("react");
function useWebSocket(url, options = {}) {
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    const [lastMessage, setLastMessage] = (0, react_1.useState)(null);
    const ws = (0, react_1.useRef)(null);
    const reconnectTimeout = (0, react_1.useRef)(null);
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
                    const message = JSON.parse(event.data);
                    setLastMessage(message);
                    options.onMessage?.(message);
                }
                catch (e) {
                    console.error('Failed to parse WebSocket message:', e);
                }
            };
        }
        catch (error) {
            console.error('WebSocket connection failed:', error);
        }
    };
    const sendMessage = (type, data) => {
        if (ws.current && isConnected) {
            const message = { type, data, timestamp: Date.now() };
            ws.current.send(JSON.stringify(message));
        }
    };
    const disconnect = () => {
        if (reconnectTimeout.current)
            clearTimeout(reconnectTimeout.current);
        if (ws.current)
            ws.current.close();
    };
    (0, react_1.useEffect)(() => { connect(); return () => { disconnect(); }; }, [url]);
    return { isConnected, lastMessage, sendMessage, disconnect, reconnect: connect };
}
