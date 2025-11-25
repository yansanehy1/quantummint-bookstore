"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BookEditor;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const textarea_1 = require("@/components/ui/textarea");
const dialog_1 = require("@/components/ui/dialog");
const tabs_1 = require("@/components/ui/tabs");
const lucide_react_1 = require("lucide-react");
const wouter_1 = require("wouter");
const sonner_1 = require("sonner");
// Helper function to render the status badge with appropriate styling
const StatusBadge = ({ status }) => {
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
    return (<div className={`px-4 py-1.5 rounded-full font-semibold text-sm shadow-md ring-2 ${classes}`}>
      {text}
    </div>);
};
function BookEditor() {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [book, setBook] = (0, react_1.useState)({
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
    });
    const [editingPage, setEditingPage] = (0, react_1.useState)(null);
    const [isEditingBook, setIsEditingBook] = (0, react_1.useState)(false);
    const [showApprovalDialog, setShowApprovalDialog] = (0, react_1.useState)(false);
    const [rejectionReason, setRejectionReason] = (0, react_1.useState)("");
    const handleBookFieldChange = (field, value) => {
        setBook({ ...book, [field]: value });
    };
    const handlePageChange = (field, value) => {
        if (editingPage) {
            setEditingPage({ ...editingPage, [field]: value });
        }
    };
    const savePage = () => {
        if (!editingPage)
            return;
        setBook({
            ...book,
            pages: book.pages.map((p) => (p.id === editingPage.id ? editingPage : p)),
        });
        setEditingPage(null);
        sonner_1.toast.success("Page updated successfully", { description: `Page ${editingPage.pageNumber} (${editingPage.title}) was saved.` });
    };
    const addNewPage = () => {
        const newPage = {
            id: Math.max(...book.pages.map((p) => p.id), 0) + 1,
            pageNumber: book.pages.length + 1,
            title: "New Page Title",
            content: "Start writing the page content here...",
            audioUrl: "",
            durationSeconds: 0,
        };
        setBook({ ...book, pages: [...book.pages, newPage] });
        setEditingPage(newPage);
        sonner_1.toast.success("New page added");
    };
    const deletePage = (pageId) => {
        setBook({
            ...book,
            pages: book.pages.filter((p) => p.id !== pageId).map((p, index) => ({
                ...p,
                pageNumber: index + 1, // Re-index pages after deletion
            })),
        });
        sonner_1.toast.success("Page deleted and re-indexed");
    };
    const saveBook = () => {
        setIsEditingBook(false);
        sonner_1.toast.success("Book details saved successfully");
    };
    const submitForApproval = () => {
        setBook({ ...book, status: "pending_approval" });
        sonner_1.toast.success("Book submitted for admin approval", { description: "The book is now in 'Pending Approval' status." });
    };
    const approveBook = () => {
        setBook({ ...book, status: "published", rejectionReason: undefined });
        sonner_1.toast.success("Book approved and published");
        setShowApprovalDialog(false);
    };
    const rejectBook = () => {
        if (!rejectionReason.trim()) {
            sonner_1.toast.error("Please provide a rejection reason");
            return;
        }
        setBook({ ...book, status: "rejected", rejectionReason });
        sonner_1.toast.success("Book rejected", { description: "The rejection reason has been recorded." });
        setShowApprovalDialog(false);
        setRejectionReason("");
    };
    const republish = () => {
        setBook({ ...book, status: "pending_approval", rejectionReason: undefined });
        sonner_1.toast.success("Book resubmitted for approval", { description: "Waiting for admin review." });
    };
    return (<div className="min-h-screen bg-slate-50 py-10 font-sans">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-extrabold text-slate-900">Book Content Editor</h1>
            <p className="text-slate-500 mt-1">Manage all aspects of your book, from metadata to page content.</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={book.status}/>
            <button_1.Button onClick={() => setLocation("/seller-dashboard")} variant="outline" className="text-slate-700 hover:bg-slate-100">
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button_1.Button>
          </div>
        </div>

        {/* Rejection Alert */}
        {book.rejectionReason && book.status === "rejected" && (<div className="mb-6 bg-red-50 border border-red-300 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-red-800 flex items-center mb-2">
              <lucide_react_1.X className="w-5 h-5 mr-2"/> REJECTED - ACTION REQUIRED
            </h3>
            <p className="text-sm text-red-700">
              **Reason:** {book.rejectionReason}
              <br />
              *Please fix the issues and resubmit the book for approval.*
            </p>
            <button_1.Button onClick={republish} className="mt-3 bg-red-600 hover:bg-red-700 text-white shadow-md">
                Resubmit for Approval
            </button_1.Button>
          </div>)}

        <tabs_1.Tabs defaultValue="details" className="w-full">
          {/* Tabs Navigation */}
          <tabs_1.TabsList className="grid w-full grid-cols-3 bg-white p-2 rounded-xl shadow-md mb-6 border border-slate-200">
            <tabs_1.TabsTrigger value="details" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-colors">Book Details</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="pages" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-colors">Pages ({book.pages.length})</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="approval" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-colors">Approval & Pricing</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          {/* Book Details Tab */}
          <tabs_1.TabsContent value="details" className="space-y-6">
            <card_1.Card className="p-6 shadow-xl rounded-xl">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Book Metadata</h2>
                <button_1.Button onClick={() => setIsEditingBook(!isEditingBook)} variant={isEditingBook ? "destructive" : "default"} className={isEditingBook ? "shadow-md" : "bg-indigo-600 hover:bg-indigo-700 shadow-md"}>
                  {isEditingBook ? <lucide_react_1.X className="w-4 h-4 mr-2"/> : <lucide_react_1.Edit2 className="w-4 h-4 mr-2"/>}
                  {isEditingBook ? "Cancel Editing" : "Edit Details"}
                </button_1.Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Book Cover Preview */}
                <div className="lg:col-span-1 flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-3 text-slate-700">Cover Preview</h3>
                  <img src={book.coverImageUrl} alt={`${book.title} Cover`} className="w-48 h-64 object-cover rounded-xl shadow-2xl border-4 border-slate-100 transition-transform hover:scale-[1.02]" onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/300x400/1e293b/f8fafc?text=Cover+Unavailable`;
        }}/>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-slate-600">Status: <StatusBadge status={book.status}/></p>
                  </div>
                </div>

                {/* Book Details Form */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                      <input_1.Input value={book.title} onChange={(e) => handleBookFieldChange("title", e.target.value)} disabled={!isEditingBook} className="w-full border-slate-300 focus:border-indigo-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Author</label>
                      <input_1.Input value={book.author} onChange={(e) => handleBookFieldChange("author", e.target.value)} disabled={!isEditingBook} className="w-full border-slate-300 focus:border-indigo-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                      <input_1.Input value={book.category} onChange={(e) => handleBookFieldChange("category", e.target.value)} disabled={!isEditingBook} className="w-full border-slate-300 focus:border-indigo-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image URL</label>
                      <input_1.Input value={book.coverImageUrl} onChange={(e) => handleBookFieldChange("coverImageUrl", e.target.value)} disabled={!isEditingBook} className="w-full border-slate-300 focus:border-indigo-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Price (USD)</label>
                      <input_1.Input type="number" value={book.priceUsd} onChange={(e) => handleBookFieldChange("priceUsd", parseFloat(e.target.value))} disabled={!isEditingBook} className="w-full border-slate-300 focus:border-indigo-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Price (SLL)</label>
                      <input_1.Input type="number" value={book.priceSll} onChange={(e) => handleBookFieldChange("priceSll", parseFloat(e.target.value))} disabled={!isEditingBook} className="w-full border-slate-300 focus:border-indigo-500"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                    <textarea_1.Textarea value={book.description} onChange={(e) => handleBookFieldChange("description", e.target.value)} disabled={!isEditingBook} rows={4} className="w-full border-slate-300 focus:border-indigo-500"/>
                  </div>

                  {isEditingBook && (<div className="pt-4 flex gap-3 border-t">
                      <button_1.Button onClick={saveBook} className="bg-green-600 hover:bg-green-700 shadow-md">
                        <lucide_react_1.Save className="w-4 h-4 mr-2"/>
                        Save Changes
                      </button_1.Button>
                      <button_1.Button onClick={submitForApproval} className="bg-blue-600 hover:bg-blue-700 shadow-md" disabled={book.status === 'pending_approval'}>
                        <lucide_react_1.Clock className="w-4 h-4 mr-2"/>
                        Submit for Approval
                      </button_1.Button>
                    </div>)}
                </div>
              </div>
            </card_1.Card>
          </tabs_1.TabsContent>

          {/* Pages Tab */}
          <tabs_1.TabsContent value="pages" className="space-y-6">
            <card_1.Card className="p-6 shadow-xl rounded-xl">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Book Pages ({book.pages.length})</h2>
                <button_1.Button onClick={addNewPage} className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
                  <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                  Add New Page
                </button_1.Button>
              </div>

              <div className="space-y-4">
                {book.pages.map((page) => (<div key={page.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-xl text-slate-800 flex items-center">
                          <lucide_react_1.BookOpen className="w-5 h-5 mr-3 text-indigo-500"/>
                          Page {page.pageNumber}: {page.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2 pr-4">{page.content}</p>
                        <div className="flex gap-4 mt-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <lucide_react_1.Clock className="w-3 h-3"/>
                            {page.durationSeconds}s Audio
                          </span>
                          <span className="truncate">URL: {page.audioUrl || "None"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <dialog_1.Dialog open={editingPage?.id === page.id} onOpenChange={(open) => { if (!open)
            setEditingPage(null); }}>
                          <dialog_1.DialogTrigger asChild>
                            <button_1.Button onClick={() => setEditingPage(page)} variant="outline" size="icon" className="text-indigo-600 border-indigo-300 hover:bg-indigo-50 transition-colors">
                              <lucide_react_1.Edit2 className="w-4 h-4"/>
                            </button_1.Button>
                          </dialog_1.DialogTrigger>
                          <dialog_1.DialogContent className="max-w-2xl">
                            <dialog_1.DialogHeader>
                              <dialog_1.DialogTitle className="text-xl font-bold text-slate-800">Edit Page {editingPage?.pageNumber}</dialog_1.DialogTitle>
                            </dialog_1.DialogHeader>
                            {editingPage && (<div className="space-y-4 pt-4">
                                <div>
                                  <label className="block text-sm font-semibold mb-1">Page Title</label>
                                  <input_1.Input value={editingPage.title} onChange={(e) => handlePageChange("title", e.target.value)}/>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold mb-1">Content</label>
                                  <textarea_1.Textarea value={editingPage.content} onChange={(e) => handlePageChange("content", e.target.value)} rows={6}/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-semibold mb-1">Audio URL</label>
                                    <input_1.Input value={editingPage.audioUrl} onChange={(e) => handlePageChange("audioUrl", e.target.value)}/>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold mb-1">Duration (seconds)</label>
                                    <input_1.Input type="number" value={editingPage.durationSeconds} onChange={(e) => handlePageChange("durationSeconds", parseInt(e.target.value) || 0)}/>
                                  </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t">
                                  <button_1.Button onClick={savePage} className="bg-green-600 hover:bg-green-700 shadow-md">Save Page Changes</button_1.Button>
                                  <button_1.Button onClick={() => setEditingPage(null)} variant="outline">Cancel</button_1.Button>
                                </div>
                              </div>)}
                          </dialog_1.DialogContent>
                        </dialog_1.Dialog>
                        <button_1.Button onClick={() => deletePage(page.id)} variant="outline" size="icon" className="border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                          <lucide_react_1.Trash2 className="w-4 h-4"/>
                        </button_1.Button>
                      </div>
                    </div>
                  </div>))}
              </div>
            </card_1.Card>
          </tabs_1.TabsContent>

          {/* Approval Tab */}
          <tabs_1.TabsContent value="approval" className="space-y-6">
            <card_1.Card className="p-6 shadow-xl rounded-xl">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-slate-800">Approval and Distribution</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Status Card */}
                <div className="p-4 rounded-lg border border-slate-300 bg-slate-50 shadow-inner">
                  <h3 className="font-bold text-lg text-slate-700 mb-3">Current Status</h3>
                  <StatusBadge status={book.status}/>
                  <p className="text-sm text-slate-500 mt-3">This reflects the current lifecycle stage of your book.</p>
                </div>

                {/* Pricing Card */}
                <div className="p-4 rounded-lg border border-slate-300 bg-slate-50 shadow-inner">
                  <h3 className="font-bold text-lg text-slate-700 mb-3">Pricing Details</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between items-center font-medium text-slate-600">
                      <span className="flex items-center gap-2"><lucide_react_1.DollarSign className="w-4 h-4 text-green-600"/> Price (USD):</span>
                      <span className="text-lg text-green-700 font-bold">${book.priceUsd.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between items-center font-medium text-slate-600">
                      <span className="flex items-center gap-2">Price (SLL):</span>
                      <span className="text-lg text-slate-700 font-bold">Le {book.priceSll.toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="p-4 rounded-lg border border-indigo-300 bg-indigo-50 shadow-lg">
                  <h3 className="font-bold text-lg text-indigo-700 mb-4">Book Actions</h3>
                  
                  {book.status === "pending_approval" && (<div className="space-y-3">
                      <p className="text-sm text-indigo-600 font-medium">Book is awaiting administrative review.</p>
                      <button_1.Button onClick={approveBook} className="w-full bg-green-600 hover:bg-green-700 shadow-md">Approve Book (Admin)</button_1.Button>
                      <dialog_1.Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                        <dialog_1.DialogTrigger asChild>
                          <button_1.Button variant="outline" className="w-full border-red-400 text-red-600 hover:bg-red-50 transition-colors">Reject Book (Admin)</button_1.Button>
                        </dialog_1.DialogTrigger>
                        <dialog_1.DialogContent>
                          <dialog_1.DialogHeader>
                            <dialog_1.DialogTitle className="text-xl font-bold text-red-800">Reject Book Confirmation</dialog_1.DialogTitle>
                          </dialog_1.DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="block text-sm font-semibold mb-2">Rejection Reason</label>
                              <textarea_1.Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Explain why the book is being rejected..." rows={4} className="border-red-300 focus:border-red-500"/>
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                              <button_1.Button onClick={rejectBook} className="bg-red-600 hover:bg-red-700">Reject and Notify</button_1.Button>
                              <button_1.Button onClick={() => setShowApprovalDialog(false)} variant="outline">Cancel</button_1.Button>
                            </div>
                          </div>
                        </dialog_1.DialogContent>
                      </dialog_1.Dialog>
                    </div>)}

                  {book.status !== "pending_approval" && (<button_1.Button className="w-full bg-slate-600 hover:bg-slate-700 shadow-md">
                      <lucide_react_1.Eye className="w-4 h-4 mr-2"/>
                      View Live Preview
                    </button_1.Button>)}
                  
                  {/* Option for DRAFT books to submit */}
                  {book.status === "draft" && (<button_1.Button onClick={submitForApproval} className="w-full bg-blue-600 hover:bg-blue-700 shadow-md mt-3">
                        <lucide_react_1.Clock className="w-4 h-4 mr-2"/>
                        Submit for Initial Approval
                      </button_1.Button>)}
                  
                </div>

              </div>
            </card_1.Card>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </div>
    </div>);
}
