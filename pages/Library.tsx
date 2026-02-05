import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Search, ShoppingCart, Headphones, BookOpen, Library as LibraryIcon, Ruler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { useStore } from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";
import { Book } from "../types";

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const { books, addToCart } = useStore();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    document.title = 'Library - Quantummint Bookstore';
  }, []);

  // Unified Categories
  const categories = [
    { id: "all", name: "All Books" },
    { id: "JSS1", name: "JSS 1" },
    { id: "JSS2", name: "JSS 2" },
    { id: "JSS3", name: "JSS 3" },
    { id: "Science", name: "Science" },
    { id: "Mathematics", name: "Mathematics" },
    { id: "Language Arts", name: "Language Arts" },
    { id: "History", name: "History" },
    { id: "Technology", name: "Technology" },
    { id: "Literature", name: "Literature" },
    { id: "Psychology", name: "Psychology" },
    { id: "Economics", name: "Economics" },
    { id: "Art", name: "Art" },
  ];

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === "all" || book.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuy = (book: Book) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(book);
    navigate('/checkout');
  };

  const renderBookCover = (book: Book) => {
    if (book.coverUrl && book.coverUrl.startsWith('icon:')) {
      const iconName = book.coverUrl.split(':')[1];
      let IconComponent = BookOpen;
      let iconColor = "text-blue-500";

      if (iconName === 'library') {
        IconComponent = LibraryIcon;
        iconColor = "text-emerald-500";
      } else if (iconName === 'ruler') {
        IconComponent = Ruler;
        iconColor = "text-purple-500";
      }

      return (
        <div className="w-full h-full flex items-center justify-center bg-amber-50">
          <IconComponent className={`w-24 h-24 ${iconColor} drop-shadow-md`} strokeWidth={1.5} />
        </div>
      );
    }

    if (book.coverUrl) {
      return (
        <img
          src={book.coverUrl}
          alt={`Cover for ${book.title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
        />
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center text-6xl bg-amber-50">📚</div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-grow p-4 md:p-8">
        <main className="container max-w-7xl mx-auto py-6 md:py-12">
          {/* Search Section */}
          <section aria-labelledby="library-heading" className="mb-12">
            <h2 id="library-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              Explore Our Library
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10 py-2 h-12 w-full border-slate-200"
                  aria-label="Search books"
                />
              </div>
              <Button
                className="bg-slate-900 hover:bg-slate-800 h-12 px-8 text-white font-medium"
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
                  className={`px-4 py-2 rounded-full font-medium transition text-sm border ${selectedCategory === cat.id
                    ? "bg-amber-600 text-white border-amber-600 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-amber-600 hover:text-amber-600"
                    }`}
                  aria-current={selectedCategory === cat.id ? 'true' : undefined}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          {/* Books Grid */}
          <section aria-labelledby="books-heading">
            <div className="flex items-center justify-between mb-6">
              <h3 id="books-heading" className="text-2xl font-bold text-slate-900">
                {filteredBooks.length} Books Found
              </h3>
            </div>

            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map(book => (
                  <Card key={book.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border-slate-100 bg-white">
                    <div
                      className="h-48 relative group overflow-hidden bg-amber-50"
                      onClick={() => navigate(`/read/${book.id}`)}
                    >
                      {renderBookCover(book)}
                    </div>

                    <div className="p-5 flex-1 flex flex-col bg-white">
                      <div className="mb-4 flex-1">
                        <h4
                          className="font-bold text-slate-900 mb-1 line-clamp-2 text-lg hover:text-amber-600 cursor-pointer"
                          onClick={() => navigate(`/read/${book.id}`)}
                        >
                          {book.title}
                        </h4>
                        <p className="text-sm text-slate-500 font-medium mb-4">{book.author}</p>

                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-amber-500">★</span>
                          <span className="text-sm font-bold text-slate-700">4.8</span>
                        </div>
                      </div>

                      <div className="pt-2 mt-auto">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xl font-bold text-amber-600">
                            ${book.price}
                          </span>
                          {/* Audio Indicator */}
                          <div className="flex items-center gap-1 text-blue-500 text-xs font-semibold" title="Audio available">
                            <Headphones className="w-3 h-3" />
                            Audio
                          </div>
                        </div>

                        <Button
                          onClick={() => handleBuy(book)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
                <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-slate-900">No books found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Library;
