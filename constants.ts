<<<<<<< HEAD
export const CURRENT_USER = {
    id: '1',
    name: 'Sierra Books Creator',
    email: 'creator@sierrabooks.com',
    role: 'seller',
    walletBalance: { usd: 150.00, sll: 2500000 }
};

export const AVAILABLE_ACCENTS = [
    'American',
    'British',
    'Australian',
    'Indian',
    'Nigerian',
    'Sierra Leonean'
=======

import { Book, SegmentType, User, VoiceProfile } from './types';

export const CURRENT_USER: User = {
  id: "user-demo-1",
  name: "Sierra Learner",
  email: "sierra@example.com",
  role: "educator", // Set to educator to enable Studio
  balance: 45.00
};

export const AVAILABLE_ACCENTS = [
  'West African (Sierra Leone)', 
  'West African (Nigeria)', 
  'East African (Kenya)', 
  'South African', 
  'American (General)', 
  'British (RP)', 
  'Indian (General)',
  'European (French-English)',
  'European (German-English)'
];

export const PREMADE_VOICES: VoiceProfile[] = [
  { id: 'voice-kore', name: 'Kore', type: 'PREMADE', accent: 'American (General)' },
  { id: 'voice-fenrir', name: 'Fenrir', type: 'PREMADE', accent: 'American (General)' },
  { id: 'voice-puck', name: 'Puck', type: 'PREMADE', accent: 'British (RP)' },
  { id: 'voice-charon', name: 'Charon', type: 'PREMADE', accent: 'American (South)' },
  { id: 'voice-aoede', name: 'Aoede', type: 'PREMADE', accent: 'British (RP)' },
  { id: 'voice-zephyr', name: 'Zephyr', type: 'PREMADE', accent: 'American (Midwest)' },
  { id: 'voice-leda', name: 'Leda', type: 'PREMADE', accent: 'British (Yorkshire)' },
  { id: 'voice-orpheus', name: 'Orpheus', type: 'PREMADE', accent: 'American (New York)' },
  { id: 'voice-thalia', name: 'Thalia', type: 'PREMADE', accent: 'Indian (General)' },
  { id: 'voice-atlas', name: 'Atlas', type: 'PREMADE', accent: 'Australian' },
  { id: 'voice-calliope', name: 'Calliope', type: 'PREMADE', accent: 'American (West Coast)' },
  { id: 'voice-helios', name: 'Helios', type: 'PREMADE', accent: 'British (Cockney)' },
  { id: 'voice-selene', name: 'Selene', type: 'PREMADE', accent: 'Irish' },
  // Previous Batch
  { id: 'voice-titan', name: 'Titan', type: 'PREMADE', accent: 'American (Deep)' },
  { id: 'voice-maia', name: 'Maia', type: 'PREMADE', accent: 'British (Soft)' },
  { id: 'voice-janus', name: 'Janus', type: 'PREMADE', accent: 'American (Broadcast)' },
  { id: 'voice-vega', name: 'Vega', type: 'PREMADE', accent: 'Australian (Upbeat)' },
  { id: 'voice-rigel', name: 'Rigel', type: 'PREMADE', accent: 'European (Technical)' },
  { id: 'voice-sirius', name: 'Sirius', type: 'PREMADE', accent: 'British (Formal)' },
  { id: 'voice-lyra', name: 'Lyra', type: 'PREMADE', accent: 'Irish (Storyteller)' },
  // New Voices
  { id: 'voice-oberon', name: 'Oberon', type: 'PREMADE', accent: 'British (Classical)' },
  { id: 'voice-titania', name: 'Titania', type: 'PREMADE', accent: 'British (Received Pronunciation)' },
  { id: 'voice-ariel', name: 'Ariel', type: 'PREMADE', accent: 'American (Soft)' },
  { id: 'voice-umbriel', name: 'Umbriel', type: 'PREMADE', accent: 'European (Deep)' },
  { id: 'voice-miranda', name: 'Miranda', type: 'PREMADE', accent: 'American (Youthful)' },
  { id: 'voice-caliban', name: 'Caliban', type: 'PREMADE', accent: 'British (Rough)' },
  { id: 'voice-prospero', name: 'Prospero', type: 'PREMADE', accent: 'American (Elder)' },
  // Latest Additions
  { id: 'voice-cressida', name: 'Cressida', type: 'PREMADE', accent: 'British (Historical)' },
  { id: 'voice-desdemona', name: 'Desdemona', type: 'PREMADE', accent: 'American (Drama)' },
  { id: 'voice-elara', name: 'Elara', type: 'PREMADE', accent: 'European (Space)' },
  { id: 'voice-thalassa', name: 'Thalassa', type: 'PREMADE', accent: 'Australian (Oceanic)' },
  { id: 'voice-hyperion', name: 'Hyperion', type: 'PREMADE', accent: 'American (Deep)' },
  { id: 'voice-nyx', name: 'Nyx', type: 'PREMADE', accent: 'Mysterious' },
  { id: 'voice-cronus', name: 'Cronus', type: 'PREMADE', accent: 'Authoritative' },
];

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: "Introduction to Quantum Physics",
    author: "Dr. A. Einstein",
    coverUrl: "https://picsum.photos/seed/quantum/300/450",
    description: "A beginner's guide to the subatomic world, featuring interactive visualizations of wave-particle duality.",
    price: 15.99,
    category: "Science",
    voiceProfileId: 'voice-kore',
    content: [
      {
        id: 's1',
        text: "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.",
        type: SegmentType.IMAGE,
        visualContent: "https://picsum.photos/seed/atom/800/600",
        visualDescription: "Visual of an atom model with orbiting electrons"
      },
      {
        id: 's2',
        text: "One of the key concepts is the Schrödinger equation, which describes how the quantum state of a physical system changes over time.",
        type: SegmentType.FORMULA,
        visualContent: "i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\hat{H}\\Psi(\\mathbf{r},t)",
        visualDescription: "The Schrödinger Equation"
      },
      {
        id: 's3',
        text: "Unlike classical mechanics, quantum mechanics deals with probabilities rather than certainties.",
        type: SegmentType.IMAGE,
        visualContent: "https://picsum.photos/seed/probability/800/600",
        visualDescription: "Probability cloud distribution"
      }
    ]
  },
  {
    id: '2',
    title: "Organic Chemistry: Alkanes",
    author: "Prof. M. Curie",
    coverUrl: "https://picsum.photos/seed/chem/300/450",
    description: "Master the basics of hydrocarbons with 3D molecular structures that assemble as you read.",
    price: 12.50,
    category: "Chemistry",
    voiceProfileId: 'voice-puck',
    content: [
      {
        id: 'c1',
        text: "Methane is the simplest alkane and the main constituent of natural gas.",
        type: SegmentType.IMAGE,
        visualContent: "https://picsum.photos/seed/methane/800/600",
        visualDescription: "Methane molecule structure"
      },
      {
        id: 'c2',
        text: "The chemical formula for Methane is CH4, representing one carbon atom bonded to four hydrogen atoms.",
        type: SegmentType.FORMULA,
        visualContent: "CH_4",
        visualDescription: "Chemical formula for Methane"
      }
    ]
  },
  {
    id: '3',
    title: "The History of Sierra Leone",
    author: "Aminata Kamara",
    coverUrl: "https://picsum.photos/seed/sierra/300/450",
    description: "An immersive journey through the rich history and culture of Sierra Leone.",
    price: 9.99,
    category: "History",
    voiceProfileId: 'voice-kore',
    content: []
  }
>>>>>>> eee79d7da06a64aee98daa05ffcfbc5ba43db233
];
