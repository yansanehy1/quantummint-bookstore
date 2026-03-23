import { VoiceProfile, FREE_VOICE_PROFILES } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const voiceProfileService = {
    // Get all available voice profiles
    async getAllVoiceProfiles(includePremium: boolean = false): Promise<VoiceProfile[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/voice-profiles?includePremium=${includePremium}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching voice profiles:', error);
            // Fallback to free profiles
            return includePremium ? FREE_VOICE_PROFILES : FREE_VOICE_PROFILES.filter(v => !v.isPremium);
        }
    },

    // Get voice profile by ID
    async getVoiceProfileById(voiceId: string): Promise<VoiceProfile | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/voice-profiles/${voiceId}`);
            
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching voice profile:', error);
            // Fallback to free profiles
            return FREE_VOICE_PROFILES.find(v => v.id === voiceId) || null;
        }
    },

    // Search voice profiles
    async searchVoiceProfiles(query: string, filters?: {
        gender?: string;
        style?: string;
        language?: string;
        accent?: string;
        isPremium?: boolean;
    }): Promise<VoiceProfile[]> {
        try {
            const params = new URLSearchParams({ query });
            
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined) {
                        params.append(key, value.toString());
                    }
                });
            }

            const response = await fetch(`${API_BASE_URL}/voice-profiles/search?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error searching voice profiles:', error);
            // Fallback to client-side filtering
            let filtered = FREE_VOICE_PROFILES;
            
            if (query) {
                filtered = filtered.filter(voice =>
                    voice.name.toLowerCase().includes(query.toLowerCase()) ||
                    voice.description.toLowerCase().includes(query.toLowerCase()) ||
                    voice.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
                );
            }

            if (filters) {
                if (filters.gender) {
                    filtered = filtered.filter(v => v.gender === filters.gender);
                }
                if (filters.style) {
                    filtered = filtered.filter(v => v.style === filters.style);
                }
                if (filters.language) {
                    filtered = filtered.filter(v => v.language === filters.language);
                }
                if (filters.accent) {
                    filtered = filtered.filter(v => v.accent === filters.accent);
                }
                if (filters.isPremium !== undefined) {
                    filtered = filtered.filter(v => v.isPremium === filters.isPremium);
                }
            }

            return filtered;
        }
    },

    // Get user's preferred voice profile
    async getUserVoicePreference(userId: string): Promise<VoiceProfile | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/voice-preference`);
            
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const voiceId = await response.json();
            return await this.getVoiceProfileById(voiceId);
        } catch (err) {
            console.error('Error fetching user voice preference:', err);
            return null;
        }
    },

    // Update user's preferred voice profile
    async updateUserVoicePreference(userId: string, voiceId: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/voice-preference`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ voiceId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating user voice preference:', error);
            throw error;
        }
    },

    // Rate a voice profile
    async rateVoiceProfile(voiceId: string, rating: number): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/voice-profiles/${voiceId}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error rating voice profile:', error);
            throw error;
        }
    },

    // Get popular voice profiles
    async getPopularVoiceProfiles(limit: number = 10): Promise<VoiceProfile[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/voice-profiles/popular?limit=${limit}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching popular voice profiles:', error);
            // Fallback to free profiles sorted by usage count
            return [...FREE_VOICE_PROFILES]
                .sort((a, b) => b.usageCount - a.usageCount)
                .slice(0, limit);
        }
    },
};

// Mock implementation for development
export const mockVoiceProfileService = {
    async getAllVoiceProfiles(includePremium: boolean = false): Promise<VoiceProfile[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return includePremium ? FREE_VOICE_PROFILES : FREE_VOICE_PROFILES.filter(v => !v.isPremium);
    },

    async getVoiceProfileById(voiceId: string): Promise<VoiceProfile | null> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return FREE_VOICE_PROFILES.find(v => v.id === voiceId) || null;
    },

    async searchVoiceProfiles(query: string, filters?: {
        gender?: string;
        style?: string;
        language?: string;
        accent?: string;
        isPremium?: boolean;
    }): Promise<VoiceProfile[]> {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        let filtered = FREE_VOICE_PROFILES;
        
        if (query) {
            filtered = filtered.filter(voice =>
                voice.name.toLowerCase().includes(query.toLowerCase()) ||
                voice.description.toLowerCase().includes(query.toLowerCase()) ||
                voice.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
        }

        if (filters) {
            if (filters.gender) {
                filtered = filtered.filter(v => v.gender === filters.gender);
            }
            if (filters.style) {
                filtered = filtered.filter(v => v.style === filters.style);
            }
            if (filters.language) {
                filtered = filtered.filter(v => v.language === filters.language);
            }
            if (filters.accent) {
                filtered = filtered.filter(v => v.accent === filters.accent);
            }
            if (filters.isPremium !== undefined) {
                filtered = filtered.filter(v => v.isPremium === filters.isPremium);
            }
        }

        return filtered;
    },

    async getUserVoicePreference(_userId: string): Promise<VoiceProfile | null> {
        await new Promise(resolve => setTimeout(resolve, 200));
        // Mock: return first free voice profile
        return FREE_VOICE_PROFILES[0];
    },

    async updateUserVoicePreference(userId: string, voiceId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log(`Updated user ${userId} voice preference to ${voiceId}`);
    },

    async rateVoiceProfile(voiceId: string, rating: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`Rated voice profile ${voiceId} with ${rating} stars`);
    },

    async getPopularVoiceProfiles(limit: number = 10): Promise<VoiceProfile[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return [...FREE_VOICE_PROFILES]
            .sort((a, b) => b.usageCount - a.usageCount)
            .slice(0, limit);
    },
};

// Export the appropriate service based on environment
export const useVoiceProfileService = () => {
    const isDevelopment = import.meta.env.DEV;
    return isDevelopment ? mockVoiceProfileService : voiceProfileService;
};
