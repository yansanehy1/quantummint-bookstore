import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StickyNote, Trash2, Plus, X, Highlighter } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

interface Note {
    id: string;
    pageId: number;
    content: string;
    color: string;
    highlightText?: string;
    createdAt: string;
}

interface NotesSidebarProps {
    bookId: string;
    currentPage: number;
    onClose: () => void;
}

export const NotesSidebar: React.FC<NotesSidebarProps> = ({ bookId, currentPage, onClose }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const [selectedColor, setSelectedColor] = useState('yellow');
    const [loading, setLoading] = useState(false);

    const colors = [
        { name: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-200' },
        { name: 'blue', bg: 'bg-blue-100', border: 'border-blue-200' },
        { name: 'green', bg: 'bg-green-100', border: 'border-green-200' },
        { name: 'pink', bg: 'bg-pink-100', border: 'border-pink-200' },
    ];

    useEffect(() => {
        fetchNotes();
    }, [bookId]);

    const fetchNotes = async () => {
        try {
            const data = await api.learner.getNotes(bookId);
            setNotes(data);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setLoading(true);
        try {
            const note = await api.learner.createNote({
                bookId,
                pageId: currentPage,
                content: newNote,
                color: selectedColor
            });
            setNotes([note, ...notes]);
            setNewNote('');
            toast.success('Note saved');
        } catch (error) {
            toast.error('Failed to save note');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await api.learner.deleteNote(id);
            setNotes(notes.filter(n => n.id !== id));
            toast.success('Note deleted');
        } catch (error) {
            toast.error('Failed to delete note');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-l border-slate-200 w-80 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                    <StickyNote size={20} className="text-quantum-600" />
                    <h3 className="font-black text-slate-900 uppercase tracking-tight">Study Notes</h3>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Add Note Section */}
                <div className="space-y-3">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note for this page..."
                        className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-quantum-500 focus:border-transparent resize-none h-24 font-medium"
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {colors.map(c => (
                                <button
                                    key={c.name}
                                    onClick={() => setSelectedColor(c.name)}
                                    className={`w-6 h-6 rounded-full ${c.bg} border-2 ${selectedColor === c.name ? 'border-slate-900' : 'border-transparent'} transition-all`}
                                />
                            ))}
                        </div>
                        <Button size="sm" onClick={handleAddNote} isLoading={loading} disabled={!newNote.trim()}>
                            <Plus size={16} className="mr-1" /> Save
                        </Button>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Saved Notes ({notes.length})</h4>
                    <div className="space-y-4">
                        {notes.length > 0 ? notes.map(note => (
                            <div 
                                key={note.id} 
                                className={`p-4 rounded-2xl border ${colors.find(c => c.name === note.color)?.bg} ${colors.find(c => c.name === note.color)?.border} relative group`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black text-slate-500 bg-white/50 px-2 py-0.5 rounded-full uppercase">
                                        Page {note.pageId + 1}
                                    </span>
                                    <button 
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                {note.highlightText && (
                                    <div className="mb-2 p-2 bg-white/40 rounded-lg text-xs italic border-l-2 border-slate-400">
                                        "{note.highlightText}"
                                    </div>
                                )}
                                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                                    {note.content}
                                </p>
                                <p className="text-[9px] text-slate-400 mt-2 font-bold">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        )) : (
                            <div className="text-center py-12 opacity-30">
                                <StickyNote size={48} className="mx-auto mb-2" />
                                <p className="text-xs font-bold uppercase tracking-widest">No notes yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
