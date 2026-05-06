import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Eye, Calculator, Clock, Award } from 'lucide-react';
import { MediaSyncPlayer } from '../components/MediaSyncPlayer';
import { AchievementBadge } from '../components/AchievementBadge';
import { useAuth } from '../contexts/AuthContext';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  pages: BookPage[];
  average_rating: number;
  total_purchases: number;
}

interface BookPage {
  id: number;
  page_number: number;
  title: string;
  content: string;
  audio_url: string;
  audio_duration: number;
}

interface MediaCue {
  id: number;
  timestamp_ms: number;
  cue_type: 'visual' | 'formula' | 'step' | 'highlight';
  content: string;
  metadata?: any;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  badge_icon_url: string;
  points_value: number;
  earned?: boolean;
  earned_at?: string;
}

export const EducationalReader: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem('auth_token') || '';
  
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [cues, setCues] = useState<MediaCue[]>([]);
  const [currentCue, setCurrentCue] = useState<MediaCue | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId || !token) return;

      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/educational/books/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch book');
        }

        const bookData = await response.json();
        setBook(bookData);
        setCues(bookData.cues || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, token]);

  // Fetch user achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/educational/achievements`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAchievements(data.achievements || []);
        }
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
      }
    };

    fetchAchievements();
  }, [token]);

  const handleCueTrigger = (cue: MediaCue) => {
    setCurrentCue(cue);
  };

  const handleProgress = (progress: number) => {
    // Progress is handled by the MediaSyncPlayer component
  };

  const goToPage = (pageIndex: number) => {
    if (book && pageIndex >= 0 && pageIndex < book.pages.length) {
      setCurrentPage(pageIndex);
    }
  };

  const renderCueContent = (cue: MediaCue) => {
    switch (cue.cue_type) {
      case 'visual':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Eye className="w-8 h-8 text-blue-600" />
            <img 
              src={cue.content} 
              alt="Visual aid"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
            {cue.metadata?.description && (
              <p className="text-sm text-gray-600 text-center">{cue.metadata.description}</p>
            )}
          </div>
        );
      
      case 'formula':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Calculator className="w-8 h-8 text-purple-600" />
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="text-xl font-mono text-center">
                {cue.content}
              </div>
            </div>
            {cue.metadata?.explanation && (
              <p className="text-sm text-gray-600 text-center">{cue.metadata.explanation}</p>
            )}
          </div>
        );
      
      case 'step':
        return (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                {cue.metadata?.step_number || 1}
              </div>
              <span className="font-semibold text-gray-900">Step {cue.metadata?.step_number || 1}</span>
            </div>
            <p className="text-gray-700">{cue.content}</p>
          </div>
        );
      
      case 'highlight':
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-gray-700">{cue.content}</p>
          </div>
        );
      
      default:
        return <p className="text-gray-700">{cue.content}</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Book not found'}</p>
          <button
            onClick={() => navigate('/library')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const currentPageData = book.pages[currentPage];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">by {book.author}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                book.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                book.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {book.difficulty_level}
              </span>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-900">
                  {achievements.filter(a => a.earned).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Text Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Page Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage + 1} of {book.pages.length}
                </span>
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === book.pages.length - 1}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Page Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {currentPageData.title}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {currentPageData.content}
                </p>
              </div>
            </div>

            {/* Media Sync Player */}
            {currentPageData.audio_url && (
              <MediaSyncPlayer
                bookId={bookId!}
                audioUrl={currentPageData.audio_url}
                token={token!}
                onProgress={handleProgress}
                onCueTrigger={handleCueTrigger}
              />
            )}

            {/* Current Cue Display */}
            {currentCue && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Cue
                </h3>
                {renderCueContent(currentCue)}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Book Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Category</span>
                  <p className="font-medium text-gray-900">{book.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Difficulty</span>
                  <p className="font-medium text-gray-900 capitalize">{book.difficulty_level}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Rating</span>
                  <p className="font-medium text-gray-900">⭐ {book.average_rating.toFixed(1)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Students</span>
                  <p className="font-medium text-gray-900">{book.total_purchases}</p>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            {achievements.filter(a => a.earned).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {achievements
                    .filter(a => a.earned)
                    .slice(0, 3)
                    .map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        size="sm"
                        showDetails={false}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Study Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-sm text-gray-600">Time Spent</span>
                    <p className="font-medium text-gray-900">2h 34m</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <div>
                    <span className="text-sm text-gray-600">Pages Read</span>
                    <p className="font-medium text-gray-900">{currentPage + 1}/{book.pages.length}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="text-sm text-gray-600">Cues Triggered</span>
                    <p className="font-medium text-gray-900">{cues.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
