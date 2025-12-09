// Mock data for book library
import { Book } from '../../../types';

export const MOCK_BOOKS: Book[] = [
    {
        id: '1',
        title: 'Introduction to Physics',
        author: 'Dr. John Smith',
        coverUrl: 'https://picsum.photos/seed/physics/300/450',
        price: 15.99,
        category: 'Science',
        chapters: [],
        description: 'Learn the fundamentals of physics',
        rating: 4.5,
        reviews: []
    },
    {
        id: '2',
        title: 'World History',
        author: 'Prof. Jane Doe',
        coverUrl: 'https://picsum.photos/seed/history/300/450',
        price: 12.99,
        category: 'History',
        chapters: [],
        description: 'Explore major events in world history',
        rating: 4.7,
        reviews: []
    }
];
