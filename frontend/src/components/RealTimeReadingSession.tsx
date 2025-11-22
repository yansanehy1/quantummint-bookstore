import React, { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface RealTimeReadingSessionProps {
  bookId: string;
  bookLevel: 'JSS' | 'SSS' | 'OTHER';
  onSessionUpdate?: (session: any) => void;
  onLowBalance?: (balance: number) => void;
}

export function RealTimeReadingSession({ bookId, bookLevel, onSessionUpdate, onLowBalance }: RealTimeReadingSessionProps) {
  const [session, setSession] = useState<any>(null);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [readingStats, setReadingStats] = useState({ timeSpent: 0, costIncurred: 0, pagesRead: 0 });

  const { isConnected, sendMessage } = useWebSocket(`ws://localhost:3000/reading-session`, { onMessage: handleWebSocketMessage, autoReconnect: true });

  function handleWebSocketMessage(message: any) {
    switch (message.type) {
      case 'session_updated':
        setSession(message.data.session);
        setReadingStats(message.data.stats);
        onSessionUpdate?.(message.data.session);
        break;
      case 'balance_updated':
        setCurrentBalance(message.data.balance);
        if (message.data.balance < 5) onLowBalance?.(message.data.balance);
        break;
      case 'session_terminated':
        setSession(null);
        break;
    }
  }

  const handleStartReading = async () => {
    const newSession = { id: cryptoRandom(), status: 'active' };
    setSession(newSession);
    sendMessage('session_started', { sessionId: newSession.id });
  };

  const handlePauseReading = async () => { if (session) sendMessage('session_paused', { sessionId: session.id }); };
  const handleResumeReading = async () => { if (session) sendMessage('session_resumed', { sessionId: session.id }); };
  const handleEndReading = async () => { if (session) { sendMessage('session_ended', { sessionId: session.id, receipt: {} }); setSession(null); } };

  return (
    <div className="reading-session-panel bg-white rounded-lg shadow-lg p-6">
      <div className="session-header flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Reading Session</h3>
        <div className="connection-status flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      {!session ? (
        <div className="session-start">
          <button onClick={handleStartReading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">Start Reading Session</button>
          <div className="mt-4 text-sm text-gray-600">
            <p>Rate: {getPricing(bookLevel)} leones per hour</p>
            <p>Current Balance: {currentBalance} SLL</p>
          </div>
        </div>
      ) : (
        <div className="session-active">
          <div className="stats-grid grid grid-cols-3 gap-4 mb-4">
            <div className="stat text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.floor(readingStats.timeSpent / 60)}m</div>
              <div className="text-xs text-gray-500">Time Spent</div>
            </div>
            <div className="stat text-center">
              <div className="text-2xl font-bold text-green-600">{readingStats.costIncurred.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Cost (SLL)</div>
            </div>
            <div className="stat text-center">
              <div className="text-2xl font-bold text-purple-600">{readingStats.pagesRead}</div>
              <div className="text-xs text-gray-500">Pages Read</div>
            </div>
          </div>
          <div className="session-controls flex space-x-2">
            {session.status === 'active' ? (
              <button onClick={handlePauseReading} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors">Pause</button>
            ) : (
              <button onClick={handleResumeReading} className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors">Resume</button>
            )}
            <button onClick={handleEndReading} className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors">End Session</button>
          </div>
          <div className="balance-warning mt-4">
            {currentBalance < 10 && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">Low balance: {currentBalance} SLL remaining</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getPricing(level: string): number {
  const pricing: any = { JSS: 1, SSS: 2, OTHER: 2.5 };
  return pricing[level] || 2.5;
}

function cryptoRandom() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
