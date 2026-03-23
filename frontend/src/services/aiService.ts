export const createAIClient = () => {
    return {
        models: {
            generateContent: async (args: any) => {
                console.log("[Mock AI] Generating content with args:", args);
                return {
                    text: () => "This is a mock AI analysis of the visual content provided. In a real environment, this would use Google Gemini 2.5 Flash to extract information from your document or image.",
                    response: {
                        candidates: [{ content: { parts: [{ text: "..." }] } }],
                        usageMetadata: { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0 }
                    }
                } as any;
            }
        },
        chats: {
            create: (config?: any) => ({
                sendMessageStream: async function* (args: any) {
                    console.log("[Mock AI Chat] Sending message:", args, "with config:", config);
                    yield { text: "This is a mock AI response from your study tutor." };
                }
            })
        }
    };
};

export const generateBookSummary = async (title: string, desc: string) => {
    return `This is a mock AI summary for "${title}". It highlights the key educational concepts and learning outcomes discussed in the book.`;
};

export const generateBookCover = async (title: string, desc: string) => {
    return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"; // Generic book cover
};
