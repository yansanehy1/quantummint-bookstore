import { ProcessedSentence } from "@/lib/textProcessor";
interface AudiobookPlayerProps {
    sentences: ProcessedSentence[];
    bookTitle: string;
    onSentenceChange?: (sentenceIndex: number) => void;
}
export default function AudiobookPlayer({ sentences, bookTitle, onSentenceChange }: AudiobookPlayerProps): import("react").JSX.Element;
export {};
