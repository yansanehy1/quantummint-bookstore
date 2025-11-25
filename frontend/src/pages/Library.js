"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Library;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const wouter_1 = require("wouter");
const Header_1 = __importDefault(require("@/components/layout/Header"));
const Footer_1 = __importDefault(require("@/components/layout/Footer"));
function Library() {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)("");
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)("all");
    const categories = [
        { id: "all", name: "All Books" },
        { id: "language-arts", name: "Language Arts" },
        { id: "science", name: "Science" },
        { id: "mathematics", name: "Mathematics" },
        { id: "literature", name: "Literature" },
        { id: "history", name: "History" },
        { id: "technology", name: "Technology" },
    ];
    const mockBooks = [
        {
            id: 0,
            title: "Language Arts - JSS 1, Term 1",
            author: "Sierra Books Admin",
            category: "language-arts",
            price: "$4.99",
            rating: 4.8,
            hasAudio: true,
            cover: "📖",
            createdBy: "Administrator",
            pages: 3,
            audioLessons: 3,
            description: "Comprehensive English Language Arts course covering greetings, questions & answers, and the English alphabet.",
        },
        {
            id: 1,
            title: "Introduction to Physics",
            author: "Dr. Ahmed Hassan",
            category: "science",
            price: "$4.99",
            rating: 4.5,
            hasAudio: true,
            cover: "📚",
        },
        {
            id: 2,
            title: "Advanced Mathematics",
            author: "Prof. Fatima Jalloh",
            category: "mathematics",
            price: "$5.99",
            rating: 4.8,
            hasAudio: true,
            cover: "📐",
        },
        {
            id: 3,
            title: "Sierra Leone History",
            author: "Dr. Koroma",
            category: "history",
            price: "$3.99",
            rating: 4.6,
            hasAudio: true,
            cover: "📖",
        },
        {
            id: 4,
            title: "Web Development Basics",
            author: "Ibrahim Tech",
            category: "technology",
            price: "$6.99",
            rating: 4.7,
            hasAudio: false,
            cover: "💻",
        },
    ];
    const filteredBooks = mockBooks.filter(book => {
        const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    return (<div className="min-h-screen">
      <Header_1.default />

      <main className="container py-12">
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Explore Our Library</h2>
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <lucide_react_1.Search className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
              <input_1.Input placeholder="Search by title or author..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 py-2 h-12"/>
            </div>
            <button_1.Button className="bg-amber-600 hover:bg-amber-700">Search</button_1.Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (<button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-full font-medium transition ${selectedCategory === cat.id
                ? "bg-amber-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-amber-600"}`}>
                {cat.name}
              </button>))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{filteredBooks.length} Books Found</h3>
          {filteredBooks.length > 0 ? (<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBooks.map(book => (<card_1.Card key={book.id} className="hover:shadow-xl transition overflow-hidden">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 h-40 flex items-center justify-center text-6xl">
                    {book.cover}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                    {book.createdBy && (<p className="text-xs text-gray-500 mb-2">Created by: {book.createdBy}</p>)}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-amber-600">{book.price}</span>
                      {book.hasAudio && (<div className="flex items-center gap-1 text-blue-600">
                          <lucide_react_1.Headphones className="w-4 h-4"/>
                          <span className="text-xs font-medium">Audio</span>
                        </div>)}
                    </div>
                    <button_1.Button onClick={() => {
                    setLocation(`/checkout?bookId=${book.id}`);
                }} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      <lucide_react_1.ShoppingCart className="w-4 h-4 mr-2"/>
                      Buy Now
                    </button_1.Button>
                  </div>
                </card_1.Card>))}
            </div>) : (<div className="text-center py-12">
              <lucide_react_1.BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
              <p className="text-gray-600 text-lg">No books found. Try a different search.</p>
            </div>)}
        </section>
      </main>
      <Footer_1.default />
    </div>);
}
