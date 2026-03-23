import * as React from 'react';
const { useState } = React;
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Chapter } from '../types';

interface ChapterEditorProps {
    chapters: Chapter[];
    onChaptersChange: (chapters: Chapter[]) => void;
    currentChapterId: string | null;
    onCurrentChapterChange: (chapterId: string | null) => void;
}

export function ChapterEditor({
    chapters,
    onChaptersChange,
    currentChapterId,
    onCurrentChapterChange,
}: ChapterEditorProps) {
    const currentChapter = chapters.find((c) => c.id === currentChapterId);

    const addChapter = () => {
        const newChapter: Chapter = {
            id: `chapter-${Date.now()}`,
            title: `Chapter ${chapters.length + 1}`,
            text: '',
            audioUrl: '',
            duration: 0,
            order: chapters.length,
        };
        onChaptersChange([...chapters, newChapter]);
        onCurrentChapterChange(newChapter.id);
    };

    const deleteChapter = (chapterId: string) => {
        const updatedChapters = chapters
            .filter((c) => c.id !== chapterId)
            .map((c, index) => ({ ...c, order: index }));
        onChaptersChange(updatedChapters);
        if (currentChapterId === chapterId) {
            onCurrentChapterChange(updatedChapters[0]?.id || null);
        }
    };

    const updateChapter = (chapterId: string, field: keyof Chapter, value: any) => {
        const updatedChapters = chapters.map((c) =>
            c.id === chapterId ? { ...c, [field]: value } : c
        );
        onChaptersChange(updatedChapters);
    };

    const moveChapter = (chapterId: string, direction: 'up' | 'down') => {
        const index = chapters.findIndex((c) => c.id === chapterId);
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === chapters.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const newChapters = [...chapters];
        [newChapters[index], newChapters[newIndex]] = [newChapters[newIndex], newChapters[index]];

        // Update order
        const reorderedChapters = newChapters.map((c, i) => ({ ...c, order: i }));
        onChaptersChange(reorderedChapters);
    };

    const estimateReadingTime = (text: string): number => {
        const words = text.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
        const wordsPerMinute = 150; // Average reading speed
        return Math.ceil((words / wordsPerMinute) * 60); // Return seconds
    };

    return (
        <div className="grid md:grid-cols-4 gap-6 h-[600px]">
            {/* Chapter List Sidebar */}
            <div className="md:col-span-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Chapters</h3>
                    <button
                        onClick={addChapter}
                        className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                        title="Add Chapter"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-2">
                    {chapters.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                            No chapters yet. Click + to add one.
                        </p>
                    ) : (
                        chapters.map((chapter, index) => (
                            <div
                                key={chapter.id}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${currentChapterId === chapter.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                                onClick={() => onCurrentChapterChange(chapter.id)}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm truncate">{chapter.title}</span>
                                    <div className="flex gap-1 ml-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveChapter(chapter.id, 'up');
                                            }}
                                            disabled={index === 0}
                                            className="p-1 hover:bg-black/10 rounded disabled:opacity-30"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveChapter(chapter.id, 'down');
                                            }}
                                            disabled={index === chapters.length - 1}
                                            className="p-1 hover:bg-black/10 rounded disabled:opacity-30"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs opacity-75">
                                    {chapter.text.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="md:col-span-3 flex flex-col">
                {currentChapter ? (
                    <>
                        {/* Chapter Title */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={currentChapter.title}
                                onChange={(e) => updateChapter(currentChapter.id, 'title', e.target.value)}
                                className="w-full text-2xl font-bold px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 outline-none bg-transparent dark:text-white"
                                placeholder="Chapter Title"
                            />
                        </div>

                        {/* Rich Text Editor */}
                        <div className="flex-1 mb-4">
                            <ReactQuill
                                theme="snow"
                                value={currentChapter.text}
                                onChange={(value) => updateChapter(currentChapter.id, 'text', value)}
                                className="h-full"
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                        ['blockquote', 'code-block'],
                                        ['clean'],
                                    ],
                                }}
                            />
                        </div>

                        {/* Stats and Actions */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="mr-4">
                                    {currentChapter.text.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
                                </span>
                                <span>
                                    ~{Math.ceil(estimateReadingTime(currentChapter.text) / 60)} min read
                                </span>
                            </div>
                            <button
                                onClick={() => deleteChapter(currentChapter.id)}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm font-medium"
                            >
                                Delete Chapter
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <p>Select a chapter or create a new one to start writing</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
