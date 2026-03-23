import * as React from 'react';
const { useState, useEffect, useRef } = React;
import { Book, UsageSession } from '../types';
import { PRICING } from '../types';
import { API_BASE_URL } from '../utils/api';

interface UsageTrackerProps {
    book: Book;
    isSubscribed: boolean;
    onSessionEnd: (session: UsageSession) => void;
}

export function UsageTracker({ book, isSubscribed, onSessionEnd }: UsageTrackerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [listeningTime, setListeningTime] = useState(0); // in seconds
    const [sessionCost, setSessionCost] = useState(0);
    const sessionStartRef = useRef<Date | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Start tracking when play begins
    const startTracking = () => {
        if (!sessionStartRef.current) {
            sessionStartRef.current = new Date();
        }
        setIsPlaying(true);

        // Update every second
        intervalRef.current = setInterval(() => {
            setListeningTime((prev) => {
                const newTime = prev + 1;

                // Calculate cost for pay-per-use (SLL per minute)
                if (!isSubscribed) {
                    const minutes = newTime / 60;
                    const costSLL = minutes * PRICING.payPerUse.perMinuteSLL;
                    setSessionCost(costSLL);
                }

                return newTime;
            });
        }, 1000);
    };

    // Stop tracking when paused
    const stopTracking = () => {
        setIsPlaying(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // End session and send to backend
    const endSession = () => {
        stopTracking();

        if (sessionStartRef.current && listeningTime > 0) {
            const session: UsageSession = {
                id: `session-${Date.now()}`,
                userId: 'current-user', // In real app, get from auth
                bookId: book.id,
                startTime: sessionStartRef.current.toISOString(),
                duration: listeningTime,
                cost: isSubscribed ? null : sessionCost,
                endTime: new Date().toISOString(),
            };

            onSessionEnd(session);

            // Send to backend
            sendToBackend(session);

            // Reset for next session
            sessionStartRef.current = null;
            setListeningTime(0);
            setSessionCost(0);
        }
    };

    const sendToBackend = async (session: UsageSession) => {
        try {
            await fetch(`${API_BASE_URL}/usage-sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session),
            });
        } catch (error) {
            console.error('Failed to send usage data:', error);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (listeningTime > 0) {
                endSession();
            }
        };
    }, []);

    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    return {
        startTracking,
        stopTracking,
        endSession,
        isPlaying,
        listeningTime,
        sessionCost,
        formatTime,
        displayCost: sessionCost.toFixed(2),
    };
}
