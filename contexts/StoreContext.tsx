import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book } from '../types';
import { MOCK_BOOKS } from '../constants';

interface StoreContextType {
    books: Book[];
    cart: Book[];
    addToCart: (book: Book) => void;
    removeFromCart: (bookId: string) => void;
    clearCart: () => void;
    selectedBook: Book | null;
    setSelectedBook: (book: Book | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [books] = useState<Book[]>(MOCK_BOOKS);
    const [cart, setCart] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

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
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            selectedBook,
            setSelectedBook
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within a StoreProvider");
    return context;
};
