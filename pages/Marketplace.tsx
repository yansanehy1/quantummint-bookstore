
import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import Button from '../components/ui/Button';
import { BookOpen, ShoppingCart, Loader2, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';

interface MarketplaceProps {
  onSelectBook: (book: Book) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onSelectBook }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { books, addToCart } = useStore();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'JSS1' | 'JSS2' | 'JSS3'>('all');

  useEffect(() => {
    document.title = 'Marketplace - Quantummint Bookstore';
  }, []);

  const handleBuy = async (book: Book) => {
    if (!user) {
      alert("Please login to purchase books.");
      return;
    }
    addToCart(book);
    navigate('/checkout');
  };

  const handleRead = (book: Book) => {
    // In a real app, we'd check if the user owns the book
    // For now, we'll just navigate to the reader
    navigate(`/read/${book.id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">QuantumMint Bookstore</h1>
          <p className="text-slate-500 mt-1">Immersive educational content for the next generation.</p>
        </div>
        <div className="flex gap-2 items-center">
          {user && (
            <span className="px-4 py-2 bg-quantum-50 text-quantum-900 rounded-full text-sm font-bold border border-quantum-200">
              Balance: ${user.balance.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 w-full bg-slate-200 relative group">
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-800">
                {book.category}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{book.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{book.author}</p>
              <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">{book.description}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <span className="text-lg font-bold text-quantum-600">${book.price}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBuy(book)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" /> Buy
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleRead(book)}>
                    <BookOpen className="w-4 h-4 mr-1" /> Read
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
