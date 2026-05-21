
import { Book, SegmentType, User, VoiceProfile } from './types/types';

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
