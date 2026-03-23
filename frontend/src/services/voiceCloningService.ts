import { VoiceClone, VoiceUploadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const voiceCloningService = {
    // Upload audio for voice cloning
    async uploadVoiceClone(
        audioFile: File,
        name: string,
        description?: string,
        creatorId: string = 'current_user'
    ): Promise<VoiceUploadResponse> {
        const formData = new FormData();
        formData.append('audio', audioFile);
        formData.append('name', name);
        if (description) {
            formData.append('description', description);
        }
        formData.append('creatorId', creatorId);

        try {
            const response = await fetch(`${API_BASE_URL}/voice-clone/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    // Don't set Content-Type header for FormData - browser sets it automatically with boundary
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading voice clone:', error);
            throw error;
        }
    },

    // Get all voice clones for a creator
    async getVoiceClones(creatorId: string = 'current_user'): Promise<VoiceClone[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/voice-clone/${creatorId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching voice clones:', error);
            throw error;
        }
    },

    // Get specific voice clone details
    async getVoiceClone(voiceId: string): Promise<VoiceClone> {
        try {
            const response = await fetch(`${API_BASE_URL}/voice-clone/details/${voiceId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching voice clone details:', error);
            throw error;
        }
    },

    // Delete a voice clone
    async deleteVoiceClone(voiceId: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/voice-clone/${voiceId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting voice clone:', error);
            throw error;
        }
    },

    // Set default voice clone
    async setDefaultVoiceClone(voiceId: string, creatorId: string = 'current_user'): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/voice-clone/set-default`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    voiceId,
                    creatorId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error setting default voice clone:', error);
            throw error;
        }
    },

    // Check processing status of voice clone
    async getVoiceCloneStatus(voiceId: string): Promise<{ status: string; progress?: number }> {
        try {
            const response = await fetch(`${API_BASE_URL}/voice-clone/status/${voiceId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking voice clone status:', error);
            throw error;
        }
    },

    // Generate test audio with voice clone
    async generateTestAudio(
        voiceId: string,
        text: string = "This is a test of your cloned voice. How does it sound?"
    ): Promise<{ audioUrl: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/voice-clone/generate-test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    voiceId,
                    text,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating test audio:', error);
            throw error;
        }
    },
};

// Mock implementation for development
export const mockVoiceCloningService = {
    async uploadVoiceClone(
        audioFile: File,
        name: string,
        description?: string,
        creatorId: string = 'current_user'
    ): Promise<VoiceUploadResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure
        if (Math.random() > 0.1) {
            return {
                voiceId: `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                status: 'processing',
                message: 'Voice clone is being processed. This usually takes 5-10 minutes.'
            };
        } else {
            throw new Error('Upload failed. Please try again.');
        }
    },

    async getVoiceClones(creatorId: string = 'current_user'): Promise<VoiceClone[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return [
            {
                id: 'voice_1',
                name: 'Professional Voice',
                description: 'Clear and professional tone for business content',
                status: 'completed',
                audioUrl: 'https://example.com/audio1.mp3',
                sampleAudioUrl: 'https://example.com/sample1.mp3',
                createdAt: '2024-01-15T10:30:00Z',
                creatorId,
                isDefault: true,
                trainingProgress: 100
            },
            {
                id: 'voice_2',
                name: 'Casual Voice',
                description: 'Relaxed and conversational tone',
                status: 'processing',
                createdAt: '2024-01-16T14:20:00Z',
                creatorId,
                isDefault: false,
                trainingProgress: 65
            }
        ];
    },

    async getVoiceClone(voiceId: string): Promise<VoiceClone> {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return {
            id: voiceId,
            name: 'Professional Voice',
            description: 'Clear and professional tone for business content',
            status: 'completed',
            audioUrl: 'https://example.com/audio1.mp3',
            sampleAudioUrl: 'https://example.com/sample1.mp3',
            createdAt: '2024-01-15T10:30:00Z',
            creatorId: 'current_user',
            isDefault: true,
            trainingProgress: 100
        };
    },

    async deleteVoiceClone(voiceId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
    },

    async setDefaultVoiceClone(voiceId: string, creatorId: string = 'current_user'): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
    },

    async getVoiceCloneStatus(voiceId: string): Promise<{ status: string; progress?: number }> {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return {
            status: 'processing',
            progress: Math.floor(Math.random() * 100)
        };
    },

    async generateTestAudio(
        voiceId: string,
        text: string = "This is a test of your cloned voice. How does it sound?"
    ): Promise<{ audioUrl: string }> {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        return {
            audioUrl: 'https://example.com/generated-test.mp3'
        };
    },
};

// Export the appropriate service based on environment
export const useVoiceCloningService = () => {
    const isDevelopment = import.meta.env.DEV;
    return isDevelopment ? mockVoiceCloningService : voiceCloningService;
};
