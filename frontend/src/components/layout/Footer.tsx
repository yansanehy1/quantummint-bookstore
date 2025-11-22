import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-amber-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Sierra Books</h3>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted partner in educational publishing and audio learning experiences.
              Empowering learners across Sierra Leone and beyond.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-gray-700 hover:bg-amber-600 p-2 rounded-lg transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-amber-600 p-2 rounded-lg transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-amber-600 p-2 rounded-lg transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setLocation("/about")} className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="text-amber-500">→</span> About Us
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/contact")} className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="text-amber-500">→</span> Contact
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/faq")} className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="text-amber-500">→</span> FAQ
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/support")} className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="text-amber-500">→</span> Support
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setLocation("/library?category=science")} className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="text-amber-500">→</span> Science
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/library?category=mathematics")} className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="text-amber-500">→</span> Mathematics
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/library?category=literature")} className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="text-amber-500">→</span> Literature
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/library?category=history")} className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="text-amber-500">→</span> History
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Freetown, Sierra Leone</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">+232 XX XXX XXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">info@sierrabooks.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © {currentYear} Sierra Books. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>in Sierra Leone</span>
            </div>
            <div className="flex gap-4 text-sm">
              <button onClick={() => setLocation("/privacy")} className="hover:text-amber-400 transition-colors duration-200">
                Privacy Policy
              </button>
              <button onClick={() => setLocation("/terms")} className="hover:text-amber-400 transition-colors duration-200">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
