import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = '404 Not Found - Quantummint Bookstore';
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-12 h-12 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Page Not Found</h1>
            <p className="text-lg text-slate-600 mb-8 max-w-md">
                Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
            <Button onClick={() => navigate('/')} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Return Home
            </Button>
        </div>
    );
}

