import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Clock,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Video,
  BookOpen,
  Headphones,
  Radio
} from 'lucide-react';
import { usePayGO } from '../hooks/usePayGO';

interface PayGOSessionManagerProps {
  productId: string;
  productType: 'video' | 'audiobook' | 'ebook' | 'live_stream';
  productTitle: string;
  quality?: string;
  className?: string;
}

export const PayGOSessionManager: React.FC<PayGOSessionManagerProps> = ({
  productId,
  productType,
  productTitle,
  quality = '480p',
  className = ''
}) => {
  const {
    wallet,
    activeSessions,
    startSession,
    updateHeartbeat,
    endSession,
    getActiveSessions,
    checkBalance
  } = usePayGO(localStorage.getItem('token') || '');

  const [currentSession, setCurrentSession] = useState<any>(null);
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find existing session for this product
  useEffect(() => {
    const existingSession = activeSessions.find(
      session => session.product_id === productId && session.status === 'active'
    );
    setCurrentSession(existingSession || null);
  }, [activeSessions, productId]);

  // Update session timer
  useEffect(() => {
    if (!currentSession) {
      setSessionTime(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const started = new Date(currentSession.started_at);
      const seconds = Math.floor((now.getTime() - started.getTime()) / 1000);
      setSessionTime(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  // Send heartbeat every 30 seconds
  useEffect(() => {
    if (!currentSession) return;

    const heartbeatInterval = setInterval(() => {
      updateHeartbeat(currentSession.session_token).catch(console.error);
    }, 30000);

    return () => clearInterval(heartbeatInterval);
  }, [currentSession, updateHeartbeat]);

  const handleStartSession = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check balance first
      const balanceCheck = await checkBalance(
        currentSession?.rate_per_minute_leones || 0.017,
        currentSession?.rate_per_minute_usd || 0.001
      );

      if (!balanceCheck.can_proceed) {
        setError('Insufficient balance to start session');
        return;
      }

      const session = await startSession(productId, productType, quality);
      setCurrentSession(session);
      await getActiveSessions(); // Refresh active sessions

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!currentSession) return;

    try {
      setLoading(true);
      await endSession(currentSession.session_token);
      setCurrentSession(null);
      setSessionTime(0);
      await getActiveSessions(); // Refresh active sessions
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end session');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return `Le ${amount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  };

  const calculateCurrentCharge = () => {
    if (!currentSession) return 0;
    const minutes = sessionTime / 60;
    return minutes * (currentSession.rate_per_minute_leones || 0.017);
  };

  const getProductIcon = () => {
    switch (productType) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'audiobook': return <Headphones className="w-5 h-5" />;
      case 'ebook': return <BookOpen className="w-5 h-5" />;
      case 'live_stream': return <Radio className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  if (!wallet) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="flex items-center space-x-2 text-gray-600">
          <AlertCircle className="w-5 h-5" />
          <span>Loading wallet information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getProductIcon()}
          <h3 className="text-lg font-semibold text-gray-900">PayGO Session</h3>
        </div>
        <div className="text-sm text-gray-600">
          {productTitle}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Session Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Session Status</span>
            <div className={`w-3 h-3 rounded-full ${
              currentSession ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {currentSession ? 'Active' : 'Not Started'}
          </div>
          {currentSession && (
            <div className="text-sm text-gray-600 mt-1">
              Started: {new Date(currentSession.started_at).toLocaleTimeString()}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Session Time</span>
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatTime(sessionTime)}
          </div>
          {currentSession && (
            <div className="text-sm text-gray-600 mt-1">
              Quality: {currentSession.current_quality}
            </div>
          )}
        </div>
      </div>

      {/* Current Charges */}
      {currentSession && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Current Charges</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-semibold text-blue-900">
            {formatCurrency(calculateCurrentCharge())}
          </div>
          <div className="text-sm text-blue-700 mt-1">
            Rate: {formatCurrency(currentSession.rate_per_minute_leones || 0.017)}/minute
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex space-x-3">
        {!currentSession ? (
          <button
            onClick={handleStartSession}
            disabled={loading || !wallet.is_active || wallet.is_suspended}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{loading ? 'Starting...' : 'Start Session'}</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleEndSession}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Square className="w-4 h-4" />
              <span>{loading ? 'Ending...' : 'End Session'}</span>
            </button>
          </>
        )}

        <button
          onClick={() => getActiveSessions()}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Balance Warning */}
      {wallet && (
        <div className="mt-4 text-sm text-gray-600">
          Available Balance: {formatCurrency(wallet.leones_balance)} SLL / ${wallet.usd_balance.toFixed(2)} USD
        </div>
      )}

      {/* Wallet Status */}
      {wallet.is_suspended && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Wallet is suspended - cannot start new sessions</span>
          </div>
        </div>
      )}
    </div>
  );
};
