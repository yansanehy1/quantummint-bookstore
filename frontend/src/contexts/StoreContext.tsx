import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '../types/types';
import { booksAPI } from '../utils/api';

interface StoreContextType {
    books: Book[];
    booksLoading: boolean;
    booksError: string | null;
    cart: Book[];
    addToCart: (book: Book) => void;
    removeFromCart: (bookId: string) => void;
    clearCart: () => void;
    selectedBook: Book | null;
    setSelectedBook: (book: Book | null) => void;
    refreshBooks: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [booksLoading, setBooksLoading] = useState(true);
    const [booksError, setBooksError] = useState<string | null>(null);
    const [cart, setCart] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const refreshBooks = async () => {
        setBooksLoading(true);
        setBooksError(null);
        try {
            const catalog = await booksAPI.getAll();
            setBooks(catalog);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load catalog';
            setBooksError(message);
        } finally {
            setBooksLoading(false);
        }
    };

    useEffect(() => {
        refreshBooks();
    }, []);

    const addToCart = (book: Book) => {
        if (!cart.find(item => item.id === book.id)) {
            setCart([...cart, book]);
        }
    };

    const removeFromCart = (bookId: string) => {
        setCart(cart.filter(item => item.id !== bookId));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <StoreContext.Provider value={{
            books,
            booksLoading,
            booksError,
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            selectedBook,
            setSelectedBook,
            refreshBooks,
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
