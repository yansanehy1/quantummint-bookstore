import { ttsService } from '../ttsService';
import api from '../../utils/api';

// Mock the API module
jest.mock('../../utils/api', () => ({
    tts: {
        synthesizeChapter: jest.fn(),
        getVoices: jest.fn(),
    },
}));

describe('TTSService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('sanitizeText', () => {
        it('should strip HTML tags', () => {
            const input = '<p>Hello <strong>World</strong></p>';
            const output = ttsService['sanitizeText'](input);
            expect(output).toBe('Hello World');
        });

        it('should normalize whitespace', () => {
            const input = 'Hello    World\nNew  Line';
            const output = ttsService['sanitizeText'](input);
            expect(output).toBe('Hello World New Line');
        });
    });

    describe('chunkText', () => {
        it('should split text into chunks based on maxLength', () => {
            const text = 'This is a long text that should be split into multiple chunks.';
            const maxLength = 20;
            const chunks = ttsService['chunkText'](text, maxLength);
            
            expect(chunks.length).toBeGreaterThan(1);
            chunks.forEach(chunk => {
                expect(chunk.length).toBeLessThanOrEqual(maxLength);
            });
        });

        it('should prefer breaking at periods', () => {
            const text = 'First sentence. Second sentence. Third sentence.';
            const maxLength = 20;
            const chunks = ttsService['chunkText'](text, maxLength);
            
            expect(chunks[0]).toBe('First sentence.');
        });
    });

    describe('validateText', () => {
        it('should return invalid for empty text', () => {
            expect(ttsService.validateText('   ').valid).toBe(false);
        });

        it('should return invalid for text exceeding 5000 characters', () => {
            const longText = 'a'.repeat(5001);
            expect(ttsService.validateText(longText).valid).toBe(false);
        });

        it('should return valid for normal text', () => {
            expect(ttsService.validateText('Hello World').valid).toBe(true);
        });
    });

    describe('calculateCost', () => {
        it('should calculate cost correctly based on character count', () => {
            const text = 'Hello'; // 5 chars
            const price = 0.01;
            expect(ttsService.calculateCost(text, price)).toBe(0.05);
        });
    });

    describe('synthesizeChapter', () => {
        it('should call api.tts.synthesizeChapter with sanitized text', async () => {
            const mockResult = { audioUrl: 'test.mp3', durationMs: 1000 };
            (api.tts.synthesizeChapter as jest.Mock).mockResolvedValue(mockResult);

            const result = await ttsService.synthesizeChapter('<p>Hello</p>');

            expect(api.tts.synthesizeChapter).toHaveBeenCalledWith(
                expect.objectContaining({ text: 'Hello' }),
                expect.any(Object)
            );
            expect(result).toEqual(mockResult);
        });

        it('should handle AbortError', async () => {
            const abortError = new Error('AbortError');
            abortError.name = 'AbortError';
            (api.tts.synthesizeChapter as jest.Mock).mockRejectedValue(abortError);

            await expect(ttsService.synthesizeChapter('test')).rejects.toThrow('AbortError');
        });
    });

    describe('synthesizeWithTimestamps', () => {
        it('should call api with returnTimestamps: true', async () => {
            const mockResult = { 
                audioUrl: 'test.mp3', 
                durationMs: 1000, 
                words: [{ word: 'Hello', startMs: 0, endMs: 500 }] 
            };
            (api.tts.synthesizeChapter as jest.Mock).mockResolvedValue(mockResult);

            const result = await ttsService.synthesizeWithTimestamps('Hello');

            expect(api.tts.synthesizeChapter).toHaveBeenCalledWith(
                expect.objectContaining({ text: 'Hello', returnTimestamps: true }),
                expect.any(Object)
            );
            expect(result).toEqual(mockResult);
        });
    });

    describe('synthesizeWithBrowserFallback', () => {
        it('should fallback to browser TTS if server fails and browser supports it', async () => {
            // Mock server failure
            (api.tts.synthesizeChapter as jest.Mock).mockRejectedValue(new Error('Server down'));
            
            // Mock browser support
            const mockSpeak = jest.fn();
            (window as any).speechSynthesis = {
                speak: mockSpeak,
                getVoices: () => [{ lang: 'en-US' }]
            };
            (window as any).SpeechSynthesisUtterance = jest.fn().mockImplementation(function(this: any) {
                setTimeout(() => this.onend(), 0);
            });

            const result = await ttsService.synthesizeWithBrowserFallback('Hello');

            expect(result.isFallback).toBe(true);
            expect(mockSpeak).toHaveBeenCalled();
        });
    });
});
