interface WebSocketMessage {
    type: string;
    data: any;
    timestamp: number;
}
export declare function useWebSocket(url: string, options?: {
    onMessage?: (message: WebSocketMessage) => void;
    autoReconnect?: boolean;
}): {
    isConnected: boolean;
    lastMessage: WebSocketMessage;
    sendMessage: (type: string, data: any) => void;
    disconnect: () => void;
    reconnect: () => void;
};
export {};
