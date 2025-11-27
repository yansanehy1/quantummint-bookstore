import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">{title}</h1>
                {children}
            </main>
            <Footer />
        </div>
    );
};
