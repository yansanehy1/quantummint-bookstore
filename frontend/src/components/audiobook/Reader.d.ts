import React from 'react';
import { Book } from '../../types';
interface ReaderProps {
    book: Book;
    onClose: () => void;
}
declare const Reader: React.FC<ReaderProps>;
export default Reader;
