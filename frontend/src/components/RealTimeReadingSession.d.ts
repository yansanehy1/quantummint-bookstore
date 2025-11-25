import React from 'react';
interface RealTimeReadingSessionProps {
    bookId: string;
    bookLevel: 'JSS' | 'SSS' | 'OTHER';
    onSessionUpdate?: (session: any) => void;
    onLowBalance?: (balance: number) => void;
}
export declare function RealTimeReadingSession({ bookId, bookLevel, onSessionUpdate, onLowBalance }: RealTimeReadingSessionProps): React.JSX.Element;
export {};
