import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface MediaCue {
  id: number;
  book_id: string;
  page_id: number;
  cue_type: 'visual' | 'formula' | 'step' | 'highlight';
  timestamp_ms: number;
  content: string;
  metadata?: any;
  position_data?: any;
}

interface ReadingProgress {
  user_id: string;
  book_id: string;
  page_id: number;
  current_position: number;
  completion_percentage: number;
  time_spent: number;
  last_accessed_at: string;
}

interface UseEducationalSyncReturn {
  cues: MediaCue[];
  currentCue: MediaCue | null;
  isConnected: boolean;
  progress: ReadingProgress | null;
  updateProgress: (bookId: string, pageId: number, position: number, completion: number, timeSpent: number) => Promise<void>;
  triggerCue: (cueId: number) => void;
  joinBook: (bookId: string) => void;
  leaveBook: (bookId: string) => void;
}

export const useEducationalSync = (token: string): UseEducationalSyncReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [cues, setCues] = useState<MediaCue[]>([]);
  const [currentCue, setCurrentCue] = useState<MediaCue | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  
  const progressTimeoutRef = useRef<NodeJS.Timeout>();
  const currentBookRef = useRef<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_MEDIA_SYNC_URL || 'http://localhost:8004', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to media sync service');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from media sync service');
      setIsConnected(false);
    });

    newSocket.on('cueTriggered', (data) => {
      const { cueId, timestamp } = data;
      const cue = cues.find(c => c.id === cueId);
      if (cue) {
        setCurrentCue(cue);
      }
    });

    newSocket.on('cueAdded', (cue: MediaCue) => {
      setCues(prev => [...prev, cue]);
    });

    newSocket.on('userPosition', (data) => {
      // Handle collaborative features - show other users' positions
      console.log('User position update:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  // Fetch cues for a book
  const fetchCues = useCallback(async (bookId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/cues/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const bookCues = await response.json();
        setCues(bookCues);
      }
    } catch (error) {
      console.error('Error fetching cues:', error);
    }
  }, [token]);

  // Fetch reading progress
  const fetchProgress = useCallback(async (bookId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/educational/progress/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const progressData = await response.json();
        if (progressData.length > 0) {
          setProgress(progressData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  }, [token]);

  // Join a book room
  const joinBook = useCallback((bookId: string) => {
    if (socket && currentBookRef.current !== bookId) {
      // Leave previous book if any
      if (currentBookRef.current) {
        socket.emit('leaveBook', currentBookRef.current);
      }

      currentBookRef.current = bookId;
      socket.emit('joinBook', bookId);
      fetchCues(bookId);
      fetchProgress(bookId);
    }
  }, [socket, fetchCues, fetchProgress]);

  // Leave a book room
  const leaveBook = useCallback((bookId: string) => {
    if (socket && currentBookRef.current === bookId) {
      socket.emit('leaveBook', bookId);
      currentBookRef.current = null;
      setCues([]);
      setCurrentCue(null);
      setProgress(null);
    }
  }, [socket]);

  // Update reading progress
  const updateProgress = useCallback(async (
    bookId: string,
    pageId: number,
    position: number,
    completion: number,
    timeSpent: number
  ) => {
    try {
      // Update local state immediately
      const newProgress: ReadingProgress = {
        user_id: '', // Will be filled by backend
        book_id: bookId,
        page_id: pageId,
        current_position: position,
        completion_percentage: completion,
        time_spent: timeSpent,
        last_accessed_at: new Date().toISOString()
      };
      setProgress(newProgress);

      // Send to backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/educational/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          book_id: bookId,
          page_id: pageId,
          current_position: position,
          completion_percentage: completion,
          time_spent: timeSpent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      // Emit real-time position update
      if (socket) {
        socket.emit('positionUpdate', {
          bookId,
          userId: '', // Will be filled by backend
          position,
          pageId
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [token, socket]);

  // Trigger a media cue
  const triggerCue = useCallback((cueId: number) => {
    if (socket) {
      socket.emit('triggerCue', {
        cueId,
        timestamp: Date.now()
      });
    }
  }, [socket]);

  // Auto-trigger cues based on timestamp
  useEffect(() => {
    if (!socket || !currentBookRef.current) return;

    const checkCues = () => {
      // This would typically be called from an audio player's timeupdate event
      // For now, it's a placeholder for the logic
    };

    return () => {
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
      }
    };
  }, [socket]);

  return {
    cues,
    currentCue,
    isConnected,
    progress,
    updateProgress,
    triggerCue,
    joinBook,
    leaveBook
  };
};
