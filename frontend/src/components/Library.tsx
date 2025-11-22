import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, ShoppingCart, Headphones } from "lucide-react";
import { useLocation } from "wouter";

export default function Library() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Books" },
    { id: "language-arts", name: "Language Arts" },
    { id: "science", name: "Science" },
    { id: "mathematics", name: "Mathematics" },
    { id: "literature", name: "Literature" },
    { id: "history", name: "History" },
    { id: "technology", name: "Technology" },
  ];

  // Mock books data - including admin-created Language Arts book
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-amber-600"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setLocation("/")}
            role="button"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setLocation("/");
              }
            }}
          >
            <BookOpen className="w-8 h-8 text-amber-600" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
          </div>
          <nav>
            <ul className="flex gap-4 items-center">
              <li>
                <button 
                  onClick={() => setLocation("/")} 
                  className="text-gray-700 hover:text-amber-600 font-medium"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/dashboard")} 
                  className="text-gray-700 hover:text-amber-600 font-medium"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation("/wallet")} 
                  className="text-gray-700 hover:text-amber-600 font-medium"
                >
                  Wallet
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container max-w-6xl mx-auto px-4 py-12">
        {/* Search Section */}
        <section aria-labelledby="library-heading" className="mb-12">
          <h2 id="library-heading" className="text-4xl font-bold text-gray-900 mb-8">
            Explore Our Library
          </h2>
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 h-12"
                aria-label="Search books"
              />
            </div>
            <Button 
              className="bg-amber-600 hover:bg-amber-700"
              aria-label="Search"
            >
              Search
            </Button>
          </div>

          {/* Categories */}
          <div 
            role="group" 
            aria-label="Book categories" 
            className="flex gap-2 flex-wrap"
          >
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedCategory === cat.id
                    ? "bg-amber-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-amber-600"
                }`}
                aria-pressed={selectedCategory === cat.id ? "true" : "false"}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Books Grid */}
        <section aria-labelledby="books-heading">
          <h3 id="books-heading" className="text-2xl font-bold text-gray-900 mb-6">
            {filteredBooks.length} Books Found
          </h3>
          {filteredBooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <Card key={book.id} className="hover:shadow-xl transition overflow-hidden">
                  <div 
                    className="bg-gradient-to-br from-amber-100 to-orange-100 h-40 flex items-center justify-center text-6xl"
                    role="img"
                    aria-label={`Cover for ${book.title}`}
                  >
                    {book.cover}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="sr-only">Author: </span>
                      {book.author}
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-500" aria-hidden="true">★</span>
                      <span className="text-sm font-medium">
                        <span className="sr-only">Rating: </span>
                        {book.rating}
                      </span>
                    </div>
                    {book.createdBy && (
                      <p className="text-xs text-gray-500 mb-2">Created by: {book.createdBy}</p>
                    )}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-amber-600">
                        <span className="sr-only">Price: </span>
                        {book.price}
                      </span>
                      {book.hasAudio && (
                        <div className="flex items-center gap-1 text-blue-600" role="status">
                          <Headphones className="w-4 h-4" aria-hidden="true" />
                          <span className="text-xs font-medium">Audio Available</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => {
                        setLocation(`/checkout?bookId=${book.id}`);
                      }}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      aria-label={`Buy ${book.title} for ${book.price}`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
                      Buy Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12" role="status">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-600 text-lg">No books found. Try a different search.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}