import React from 'react';
import { Book } from '../../types';
interface StudioProps {
    onPreview: (book: Book) => void;
}
declare const Studio: React.FC<StudioProps>;
export default Studio;
