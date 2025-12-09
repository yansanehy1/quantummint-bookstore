<<<<<<< HEAD

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Edit2, Save, X, Plus, Trash2, Eye, Clock, BookOpen, DollarSign, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { generateAudio } from "@/services/geminiService";

interface BookPage {
  id: number;
  pageNumber: number;
  title: string;
  content: string;
  audioUrl: string;
  durationSeconds: number;
}

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  category: string;
  priceUsd: number;
  priceSll: number;
  coverImageUrl: string;
  status: "draft" | "pending_approval" | "published" | "rejected";
  pages: BookPage[];
  rejectionReason?: string;
}

const StatusBadge = ({ status }: { status: Book["status"] }) => {
  let classes = "";
  let text = status.replace("_", " ").toUpperCase();

  switch (status) {
    case "published":
      classes = "bg-green-600 text-green-50 ring-green-200";
      break;
    case "pending_approval":
      classes = "bg-yellow-600 text-yellow-50 ring-yellow-200";
      break;
    case "rejected":
      classes = "bg-red-600 text-red-50 ring-red-200";
      break;
    case "draft":
    default:
      classes = "bg-slate-600 text-slate-50 ring-slate-200";
      break;
  }

  return (
    <div className={`px-4 py-1.5 rounded-full font-semibold text-sm shadow-md ring-2 ${classes}`}>
      {text}
    </div>
  );
};

export const BookEditor = () => {
  const [, setLocation] = useLocation();
  const [params] = useLocation();
  const bookId = params.split('/').pop(); // Get the ID from URL
  const isNewBook = bookId === 'new';

  const [book, setBook] = useState<Book>(
    isNewBook
      ? {
        // New book - empty state
        id: Date.now(),
        title: "",
        author: "Your Name",
        description: "",
        category: "General",
        priceUsd: 0,
        priceSll: 0,
        coverImageUrl: "https://placehold.co/300x400/1e293b/f8fafc?text=New+Book",
        status: "draft",
        pages: [],
        rejectionReason: undefined,
      }
      : {
        // Existing book - mock data
        id: 1,
        title: "Language Arts - JSS 1, Term 1",
        author: "Sierra Books Admin",
        description: "Comprehensive English Language Arts course for Junior Secondary School 1, covering foundational grammar, reading comprehension, and creative writing skills. Fully compliant with the national curriculum.",
        category: "Language Arts",
        priceUsd: 4.99,
        priceSll: 82000,
        coverImageUrl: "https://placehold.co/300x400/1e293b/f8fafc?text=Book+Cover",
        status: "published",
        pages: [
          {
            id: 1,
            pageNumber: 1,
            title: "Unit 1: Greetings",
            content: "Learn how to greet people at different times of the day using formal and informal language. We cover 'Good morning', 'Good afternoon', and 'Good evening' structures.",
            audioUrl: "https://example.com/audio/unit1.mp3",
            durationSeconds: 480,
          },
          {
            id: 2,
            pageNumber: 2,
            title: "Unit 2: Questions & Answers",
            content: "Master asking and answering questions politely. Focus on 'Wh' questions (Who, What, Where, When, Why) and appropriate tonal variations.",
            audioUrl: "https://example.com/audio/unit2.mp3",
            durationSeconds: 520,
          },
          {
            id: 3,
            pageNumber: 3,
            title: "Unit 3: Parts of Speech",
            content: "A deep dive into nouns, verbs, adjectives, and adverbs. Understand their functions and placement within sentences.",
            audioUrl: "https://example.com/audio/unit3.mp3",
            durationSeconds: 610,
          },
        ],
      }
  );

  const [editingPage, setEditingPage] = useState<BookPage | null>(null);
  const [isEditingBook, setIsEditingBook] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const handleBookFieldChange = (field: keyof Book, value: any) => {
    setBook({ ...book, [field]: value });
  };

  const handlePageChange = (field: keyof BookPage, value: any) => {
    if (editingPage) {
      setEditingPage({ ...editingPage, [field]: value });
    }
  };

  const savePage = async () => {
    if (!editingPage) return;

    setIsGeneratingAudio(true);
    toast.info("Saving page and regenerating audio...");

    try {
      // Regenerate audio for the edited content
      const audioUrl = await generateAudio(editingPage.content, 'Kore');

      // Estimate duration based on content length (roughly 150 words per minute)
      const wordCount = editingPage.content.split(/\s+/).length;
      const estimatedDuration = Math.ceil((wordCount / 150) * 60);

      // Update the page with new audio URL and duration
      const updatedPage = {
        ...editingPage,
        audioUrl: audioUrl,
        durationSeconds: estimatedDuration
      };

      setBook({
        ...book,
        pages: book.pages.map((p) => (p.id === editingPage.id ? updatedPage : p)),
      });

      setEditingPage(null);
      toast.success("Page updated and audio regenerated successfully!");
    } catch (error) {
      console.error("Error regenerating audio:", error);
      // Save without audio update if generation fails
      setBook({
        ...book,
        pages: book.pages.map((p) => (p.id === editingPage.id ? editingPage : p)),
      });
      toast.warning("Page saved, but audio regeneration failed. You can try again later.");
      setEditingPage(null);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const addNewPage = () => {
    const newPage: BookPage = {
      id: Math.max(...book.pages.map((p) => p.id), 0) + 1,
      pageNumber: book.pages.length + 1,
      title: "New Page Title",
      content: "Start writing the page content here...",
      audioUrl: "",
      durationSeconds: 0,
    };
    setBook({ ...book, pages: [...book.pages, newPage] });
    setEditingPage(newPage);
    toast.success("New page added");
  };

  const deletePage = (pageId: number) => {
    setBook({
      ...book,
      pages: book.pages.filter((p) => p.id !== pageId).map((p, index) => ({
        ...p,
        pageNumber: index + 1,
      })),
    });
    toast.success("Page deleted");
  };

  const saveBook = () => {
    setIsEditingBook(false);
    toast.success("Book details saved successfully");
  };

  const submitForApproval = () => {
    setBook({ ...book, status: "pending_approval" });
    toast.success("Book submitted for admin approval");
  };

  const approveBook = () => {
    setBook({ ...book, status: "published", rejectionReason: undefined });
    toast.success("Book approved and published");
    setShowApprovalDialog(false);
  };

  const rejectBook = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setBook({ ...book, status: "rejected", rejectionReason });
    toast.success("Book rejected");
    setShowApprovalDialog(false);
    setRejectionReason("");
  };

  const republish = () => {
    setBook({ ...book, status: "pending_approval", rejectionReason: undefined });
    toast.success("Book resubmitted for approval");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-extrabold text-slate-900">Book Content Editor</h1>
            <p className="text-slate-500 mt-1">Manage all aspects of your book, from metadata to page content.</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={book.status} />
            <Button onClick={() => setLocation("/seller-dashboard")} variant="outline" className="text-slate-700 hover:bg-slate-100">
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Button>
          </div>
        </div>

        {book.rejectionReason && book.status === "rejected" && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-red-800 flex items-center mb-2">
              <X className="w-5 h-5 mr-2" /> REJECTED - ACTION REQUIRED
            </h3>
            <p className="text-sm text-red-700">
              **Reason:** {book.rejectionReason}
              <br />
              *Please fix the issues and resubmit the book for approval.*
            </p>
            <Button onClick={republish} className="mt-3 bg-red-500 hover:bg-red-600 text-white shadow-md">
              Resubmit for Approval
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white p-2 rounded-xl shadow-md mb-6 border border-slate-200">
            <TabsTrigger value="details">Book Details</TabsTrigger>
            <TabsTrigger value="pages">Pages ({book.pages.length})</TabsTrigger>
            <TabsTrigger value="approval">Approval & Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card className="p-6 shadow-xl rounded-xl">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Book Metadata</h2>
                <Button onClick={() => setIsEditingBook(!isEditingBook)} variant={isEditingBook ? "danger" : "primary"} className={isEditingBook ? "shadow-md" : "bg-indigo-600 hover:bg-indigo-700 shadow-md"}>
                  {isEditingBook ? <X className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                  {isEditingBook ? "Cancel Editing" : "Edit Details"}
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-3 text-slate-700">Cover Preview</h3>
                  <img
                    src={book.coverImageUrl}
                    alt={`${book.title} Cover`}
                    className="w-48 h-64 object-cover rounded-xl shadow-2xl border-4 border-slate-100 transition-transform hover:scale-[1.02]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = `https://placehold.co/300x400/1e293b/f8fafc?text=Cover+Unavailable`;
                    }}
                  />
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-slate-600">Status: <StatusBadge status={book.status} /></p>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                      <Input value={book.title} onChange={(e) => handleBookFieldChange("title", e.target.value)} disabled={!isEditingBook} className="w-full border-slate-300 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Author</label>
                      <Input value={book.author} onChange={(e) => handleBookFieldChange("author", e.target.value)} disabled={!isEditingBook} className="w-full border-slate-300 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                      <Input value={book.category} onChange={(e) => handleBookFieldChange("category", e.target.value)} disabled={!isEditingBook} className="w-full border-slate-300 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image URL</label>
                      <Input value={book.coverImageUrl} onChange={(e) => handleBookFieldChange("coverImageUrl", e.target.value)} disabled={!isEditingBook} className="w-full border-slate-300 focus:border-indigo-500" />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📊 Pricing Model</h4>
                    <p className="text-sm text-blue-700">
                      This platform uses <strong>pay-per-use pricing</strong>. Learners are charged based on their actual listening, reading, or watching time—not a fixed book price. Your earnings are calculated automatically based on engagement.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                    <Textarea value={book.description} onChange={(e) => handleBookFieldChange("description", e.target.value)} disabled={!isEditingBook} rows={4} className="w-full border-slate-300 focus:border-indigo-500" />
                  </div>

                  {isEditingBook && (
                    <div className="pt-4 flex gap-3 border-t">
                      <Button onClick={saveBook} className="bg-green-600 hover:bg-green-700 shadow-md">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button onClick={submitForApproval} className="bg-blue-600 hover:bg-blue-700 shadow-md" disabled={book.status === 'pending_approval'}>
                        <Clock className="w-4 h-4 mr-2" />
                        Submit for Approval
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <Card className="p-6 shadow-xl rounded-xl">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Book Pages ({book.pages.length})</h2>
                <Button onClick={addNewPage} className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Page
                </Button>
              </div>

              <div className="space-y-4">
                {book.pages.map((page) => (
                  <div
                    key={page.id}
                    className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-xl text-slate-800 flex items-center">
                          <BookOpen className="w-5 h-5 mr-3 text-indigo-500" />
                          Page {page.pageNumber}: {page.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2 pr-4">{page.content}</p>
                        <div className="flex gap-4 mt-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {page.durationSeconds}s Audio
                          </span>
                          <span className="truncate">URL: {page.audioUrl || "None"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Dialog open={editingPage?.id === page.id} onOpenChange={(open) => { if (!open) setEditingPage(null); }}>
                          <DialogTrigger>
                            <Button onClick={() => setEditingPage(page)} variant="outline" size="icon" className="text-indigo-600 border-indigo-300 hover:bg-indigo-50 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-slate-800">Edit Page {editingPage?.pageNumber}</DialogTitle>
                            </DialogHeader>
                            {editingPage && (
                              <div className="space-y-4 pt-4">
                                <div>
                                  <label className="block text-sm font-semibold mb-1">Page Title</label>
                                  <Input value={editingPage.title} onChange={(e) => handlePageChange("title", e.target.value)} />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold mb-1">Content</label>
                                  <Textarea value={editingPage.content} onChange={(e) => handlePageChange("content", e.target.value)} rows={6} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-semibold mb-1">Audio URL</label>
                                    <Input value={editingPage.audioUrl} onChange={(e) => handlePageChange("audioUrl", e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold mb-1">Duration (seconds)</label>
                                    <Input type="number" value={editingPage.durationSeconds} onChange={(e) => handlePageChange("durationSeconds", parseInt(e.target.value) || 0)} />
                                  </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t">
                                  <Button
                                    onClick={savePage}
                                    className="bg-green-600 hover:bg-green-700 shadow-md"
                                    disabled={isGeneratingAudio}
                                  >
                                    {isGeneratingAudio ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Regenerating Audio...
                                      </>
                                    ) : (
                                      <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save & Regenerate Audio
                                      </>
                                    )}
                                  </Button>
                                  <Button onClick={() => setEditingPage(null)} variant="outline" disabled={isGeneratingAudio}>Cancel</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button onClick={() => deletePage(page.id)} variant="outline" size="icon" className="border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="approval" className="space-y-6">
            <Card className="p-6 shadow-xl rounded-xl">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-slate-800">Approval and Distribution</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg border border-slate-300 bg-slate-50 shadow-inner">
                  <h3 className="font-bold text-lg text-slate-700 mb-3">Current Status</h3>
                  <StatusBadge status={book.status} />
                  <p className="text-sm text-slate-500 mt-3">This reflects the current lifecycle stage of your book.</p>
                </div>

                <div className="p-4 rounded-lg border border-slate-300 bg-slate-50 shadow-inner">
                  <h3 className="font-bold text-lg text-slate-700 mb-3">Revenue Model</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-indigo-200">
                      <p className="text-sm font-semibold text-indigo-900 mb-1">⏱️ Pay-Per-Use Pricing</p>
                      <p className="text-xs text-slate-600">
                        Learners pay based on actual usage time (reading, listening, or watching). You earn revenue proportional to engagement.
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-200">
                      <p className="text-sm font-semibold text-green-900 mb-1">💰 Revenue Calculation</p>
                      <p className="text-xs text-slate-600">
                        Earnings = Time Consumed × Platform Rate
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Rates vary by content type and quality tier
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-amber-200">
                      <p className="text-sm font-semibold text-amber-900 mb-1">📈 Total Book Duration</p>
                      <p className="text-xs text-slate-600">
                        {book.pages.reduce((sum, page) => sum + page.durationSeconds, 0)} seconds
                        ({Math.ceil(book.pages.reduce((sum, page) => sum + page.durationSeconds, 0) / 60)} minutes)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-indigo-300 bg-indigo-50 shadow-lg">
                  <h3 className="font-bold text-lg text-indigo-700 mb-4">Book Actions</h3>

                  {book.status === "pending_approval" && (
                    <div className="space-y-3">
                      <p className="text-sm text-indigo-600 font-medium">Book is awaiting administrative review.</p>
                      <Button onClick={approveBook} className="w-full bg-green-600 hover:bg-green-700 shadow-md">Approve Book (Admin)</Button>
                      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                        <DialogTrigger>
                          <Button variant="outline" className="w-full border-red-400 text-red-600 hover:bg-red-50 transition-colors">Reject Book (Admin)</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-red-800">Reject Book Confirmation</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="block text-sm font-semibold mb-2">Rejection Reason</label>
                              <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Explain why the book is being rejected..." rows={4} className="border-red-300 focus:border-red-500" />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                              <Button onClick={rejectBook} className="bg-red-600 hover:bg-red-700">Reject and Notify</Button>
                              <Button onClick={() => setShowApprovalDialog(false)} variant="outline">Cancel</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {book.status !== "pending_approval" && (
                    <Button className="w-full bg-slate-600 hover:bg-slate-700 shadow-md">
                      <Eye className="w-4 h-4 mr-2" />
                      View Live Preview
                    </Button>
                  )}

                  {book.status === "draft" && (
                    <Button onClick={submitForApproval} className="w-full bg-blue-600 hover:bg-blue-700 shadow-md mt-3">
                      <Clock className="w-4 h-4 mr-2" />
                      Submit for Initial Approval
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};




=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Edit2, Save, Plus, Trash2, BookOpen, Clock, DollarSign, Eye, X
} from 'lucide-react';

interface Page {
    id: number;
    pageNumber: number;
    title: string;
    content: string;
    audioUrl: string;
    durationSeconds: number;
}

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    category: string;
    priceUsd: number;
    priceSll: number;
    coverImageUrl: string;
    status: 'draft' | 'pending_approval' | 'published' | 'rejected';
    rejectionReason?: string;
    pages: Page[];
}

const BookEditor: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'details' | 'pages' | 'approval'>('details');
    const [isEditingBook, setIsEditingBook] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

    const [book, setBook] = useState<Book>({
        id: 1,
        title: "Language Arts - JSS 1, Term 1",
        author: "Sierra Books Admin",
        description: "Comprehensive English Language Arts course for Junior Secondary School 1",
        category: "Language Arts",
        priceUsd: 4.99,
        priceSll: 82000,
        coverImageUrl: "https://placehold.co/300x400/blue/white?text=Language+Arts",
        status: "published",
        pages: [
            { id: 1, pageNumber: 1, title: "Unit 1: Greetings", content: "Learn how to greet people...", audioUrl: "", durationSeconds: 480 },
            { id: 2, pageNumber: 2, title: "Unit 2: Questions", content: "Master asking questions...", audioUrl: "", durationSeconds: 520 },
        ]
    });

    useEffect(() => {
        document.title = 'Book Editor - Quantummint Bookstore';
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors = {
            published: 'bg-green-600 text-white',
            pending_approval: 'bg-yellow-600 text-white',
            rejected: 'bg-red-600 text-white',
            draft: 'bg-gray-600 text-white'
        };
        return (
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${colors[status as keyof typeof colors]}`}>
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    const handleBookFieldChange = (field: keyof Book, value: any) => {
        setBook({ ...book, [field]: value });
    };

    const saveBook = () => {
        setIsEditingBook(false);
        showToast('Book details saved successfully');
    };

    const addNewPage = () => {
        const newPage: Page = {
            id: Math.max(...book.pages.map(p => p.id), 0) + 1,
            pageNumber: book.pages.length + 1,
            title: "New Page",
            content: "Start writing...",
            audioUrl: "",
            durationSeconds: 0
        };
        setBook({ ...book, pages: [...book.pages, newPage] });
        setEditingPage(newPage);
        showToast('New page added');
    };

    const savePage = () => {
        if (!editingPage) return;
        setBook({
            ...book,
            pages: book.pages.map(p => p.id === editingPage.id ? editingPage : p)
        });
        setEditingPage(null);
        showToast('Page saved');
    };

    const deletePage = (pageId: number) => {
        if (confirm('Delete this page?')) {
            setBook({
                ...book,
                pages: book.pages.filter(p => p.id !== pageId).map((p, i) => ({ ...p, pageNumber: i + 1 }))
            });
            showToast('Page deleted');
        }
    };

    const submitForApproval = () => {
        setBook({ ...book, status: 'pending_approval' });
        showToast('Submitted for approval');
    };

    const approveBook = () => {
        setBook({ ...book, status: 'published', rejectionReason: undefined });
        showToast('Book approved and published');
    };

    const rejectBook = () => {
        if (!rejectionReason.trim()) {
            showToast('Please provide a reason', 'error');
            return;
        }
        setBook({ ...book, status: 'rejected', rejectionReason });
        setShowRejectDialog(false);
        setRejectionReason('');
        showToast('Book rejected');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-2xl z-50 ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    } text-white`}>
                    {toast.message}
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Book Content Editor</h1>
                        <p className="text-gray-600">Manage book metadata and content</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <StatusBadge status={book.status} />
                        <button onClick={() => navigate('/seller/dashboard')}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Rejection Alert */}
                {book.status === 'rejected' && book.rejectionReason && (
                    <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-6">
                        <h3 className="font-bold text-red-800 flex items-center mb-2">
                            <X className="w-5 h-5 mr-2" /> REJECTED - ACTION REQUIRED
                        </h3>
                        <p className="text-red-700 mb-3">Reason: {book.rejectionReason}</p>
                        <button onClick={() => submitForApproval()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Resubmit for Approval
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {['details', 'pages', 'approval'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 rounded-lg font-semibold ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                                }`}>
                            {tab === 'details' ? 'Book Details' : tab === 'pages' ? `Pages (${book.pages.length})` : 'Approval'}
                        </button>
                    ))}
                </div>

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Book Metadata</h2>
                            <button onClick={() => setIsEditingBook(!isEditingBook)}
                                className={`px-4 py-2 rounded-lg font-semibold ${isEditingBook ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                                    }`}>
                                {isEditingBook ? <><X className="w-4 h-4 inline mr-2" />Cancel</> : <><Edit2 className="w-4 h-4 inline mr-2" />Edit</>}
                            </button>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center">
                                <img src={book.coverImageUrl} alt="Cover" className="w-48 h-64 object-cover rounded-xl shadow-lg mb-4" />
                                <StatusBadge status={book.status} />
                            </div>

                            <div className="lg:col-span-2 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Title</label>
                                        <input value={book.title} onChange={(e) => handleBookFieldChange('title', e.target.value)}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Author</label>
                                        <input value={book.author} onChange={(e) => handleBookFieldChange('author', e.target.value)}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Category</label>
                                        <input value={book.category} onChange={(e) => handleBookFieldChange('category', e.target.value)}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Cover Image URL</label>
                                        <input value={book.coverImageUrl} onChange={(e) => handleBookFieldChange('coverImageUrl', e.target.value)}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Price (USD)</label>
                                        <input type="number" value={book.priceUsd} onChange={(e) => handleBookFieldChange('priceUsd', parseFloat(e.target.value))}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Price (SLL)</label>
                                        <input type="number" value={book.priceSll} onChange={(e) => handleBookFieldChange('priceSll', parseFloat(e.target.value))}
                                            disabled={!isEditingBook}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Description</label>
                                    <textarea value={book.description} onChange={(e) => handleBookFieldChange('description', e.target.value)}
                                        disabled={!isEditingBook} rows={4}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>

                                {isEditingBook && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button onClick={saveBook} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                            <Save className="w-4 h-4 inline mr-2" />Save
                                        </button>
                                        <button onClick={submitForApproval} disabled={book.status === 'pending_approval'}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                            <Clock className="w-4 h-4 inline mr-2" />Submit for Approval
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pages Tab */}
                {activeTab === 'pages' && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Book Pages ({book.pages.length})</h2>
                            <button onClick={addNewPage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                <Plus className="w-4 h-4 inline mr-2" />Add Page
                            </button>
                        </div>

                        <div className="space-y-4">
                            {book.pages.map(page => (
                                <div key={page.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg flex items-center">
                                                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                                Page {page.pageNumber}: {page.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{page.content}</p>
                                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                                <span><Clock className="w-3 h-3 inline" /> {page.durationSeconds}s</span>
                                                <span className="truncate">Audio: {page.audioUrl || 'None'}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button onClick={() => setEditingPage(page)}
                                                className="px-3 py-2 text-blue-600 border border-blue-300 rounded hover:bg-blue-50">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deletePage(page.id)}
                                                className="px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Edit Page Dialog */}
                        {editingPage && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                    <h2 className="text-2xl font-bold mb-4">Edit Page {editingPage.pageNumber}</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Title</label>
                                            <input value={editingPage.title} onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Content</label>
                                            <textarea value={editingPage.content} onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                                                rows={6} className="w-full p-2 border border-gray-300 rounded-lg" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold mb-1">Audio URL</label>
                                                <input value={editingPage.audioUrl} onChange={(e) => setEditingPage({ ...editingPage, audioUrl: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-1">Duration (seconds)</label>
                                                <input type="number" value={editingPage.durationSeconds}
                                                    onChange={(e) => setEditingPage({ ...editingPage, durationSeconds: parseInt(e.target.value) || 0 })}
                                                    className="w-full p-2 border border-gray-300 rounded-lg" />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4 border-t">
                                            <button onClick={savePage} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
                                            <button onClick={() => setEditingPage(null)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Approval Tab */}
                {activeTab === 'approval' && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Approval & Distribution</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold mb-3">Status</h3>
                                <StatusBadge status={book.status} />
                            </div>
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold mb-3">Pricing</h3>
                                <div className="space-y-2">
                                    <p className="flex justify-between">
                                        <span><DollarSign className="w-4 h-4 inline text-green-600" /> USD:</span>
                                        <span className="font-bold">${book.priceUsd}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>SLL:</span>
                                        <span className="font-bold">Le {book.priceSll.toLocaleString()}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 border rounded-lg bg-blue-50">
                                <h3 className="font-bold mb-4">Actions</h3>
                                {book.status === 'pending_approval' && (
                                    <div className="space-y-3">
                                        <button onClick={approveBook} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                            Approve (Admin)
                                        </button>
                                        <button onClick={() => setShowRejectDialog(true)} className="w-full px-4 py-2 border border-red-400 text-red-600 rounded-lg hover:bg-red-50">
                                            Reject (Admin)
                                        </button>
                                    </div>
                                )}
                                {book.status === 'draft' && (
                                    <button onClick={submitForApproval} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        <Clock className="w-4 h-4 inline mr-2" />Submit
                                    </button>
                                )}
                                <button className="w-full px-4 py-2 mt-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <Eye className="w-4 h-4 inline mr-2" />Preview
                                </button>
                            </div>
                        </div>

                        {/* Reject Dialog */}
                        {showRejectDialog && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                                    <h2 className="text-2xl font-bold text-red-800 mb-4">Reject Book</h2>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Rejection Reason</label>
                                        <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Explain why..." rows={4}
                                            className="w-full p-2 border border-red-300 rounded-lg" />
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={rejectBook} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
                                        <button onClick={() => setShowRejectDialog(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookEditor;
>>>>>>> eee79d7da06a64aee98daa05ffcfbc5ba43db233
