// Book Update Notification Service
// This service handles notifying users when books they're reading/listening to are updated

export interface BookUpdate {
    bookId: string;
    bookTitle: string;
    updateType: 'chapter_added' | 'chapter_edited' | 'chapter_deleted' | 'metadata_updated';
    chapterNumber?: number;
    chapterTitle?: string;
    changes: string;
    timestamp: Date;
}

export interface ActiveReader {
    userId: string;
    bookId: string;
    currentChapter: number;
    lastAccessedAt: Date;
}

class BookUpdateNotificationService {
    private activeReaders: Map<string, ActiveReader[]> = new Map();

    /**
     * Register a user as actively reading/listening to a book
     */
    registerActiveReader(userId: string, bookId: string, currentChapter: number) {
        const readers = this.activeReaders.get(bookId) || [];
        const existingReader = readers.find(r => r.userId === userId);

        if (existingReader) {
            existingReader.currentChapter = currentChapter;
            existingReader.lastAccessedAt = new Date();
        } else {
            readers.push({
                userId,
                bookId,
                currentChapter,
                lastAccessedAt: new Date(),
            });
        }

        this.activeReaders.set(bookId, readers);
    }

    /**
     * Get all active readers for a book (accessed within last 24 hours)
     */
    getActiveReaders(bookId: string): ActiveReader[] {
        const readers = this.activeReaders.get(bookId) || [];
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        return readers.filter(r => r.lastAccessedAt > oneDayAgo);
    }

    /**
     * Notify all active readers when a book is updated
     */
    async notifyBookUpdate(update: BookUpdate): Promise<void> {
        const activeReaders = this.getActiveReaders(update.bookId);

        if (activeReaders.length === 0) {
            console.log(`No active readers for book ${update.bookId}`);
            return;
        }

        console.log(`Notifying ${activeReaders.length} readers about update to "${update.bookTitle}"`);

        const notifications = activeReaders.map(reader => ({
            userId: reader.userId,
            notification: {
                id: `${update.bookId}-${Date.now()}`,
                bookId: update.bookId,
                bookTitle: update.bookTitle,
                updateType: update.updateType,
                chapterNumber: update.chapterNumber,
                chapterTitle: update.chapterTitle,
                message: this.generateNotificationMessage(update, reader),
                timestamp: update.timestamp.toISOString(),
                read: false,
            },
        }));

        // In a production environment, this would trigger a push notification or WebSocket event
        // via a centralized notification service.
        await this.sendNotifications(notifications);
    }

    /**
     * Generate a user-friendly notification message
     */
    private generateNotificationMessage(update: BookUpdate, reader: ActiveReader): string {
        const { updateType, chapterNumber, chapterTitle, changes } = update;

        switch (updateType) {
            case 'chapter_added':
                return `New chapter added: Chapter ${chapterNumber} - ${chapterTitle}`;

            case 'chapter_edited':
                if (chapterNumber && chapterNumber <= reader.currentChapter) {
                    return `Chapter ${chapterNumber} (${chapterTitle}) has been updated. You may want to re-read/listen to this chapter.`;
                }
                return `Chapter ${chapterNumber} (${chapterTitle}) has been updated: ${changes}`;

            case 'chapter_deleted':
                if (chapterNumber && chapterNumber <= reader.currentChapter) {
                    return `⚠️ Chapter ${chapterNumber} has been removed. Your reading position may have changed.`;
                }
                return `Chapter ${chapterNumber} has been removed from the book`;

            case 'metadata_updated':
                return `Book information has been updated: ${changes}`;

            default:
                return `The book has been updated`;
        }
    }

    /**
     * Send notifications to users
     */
    private async sendNotifications(notifications: Array<{ userId: string; notification: BookUpdateNotification }>): Promise<void> {
        // Implementation for actual notification delivery
        // For production, this should integrate with a backend service via WebSocket or Push API
        console.log('Dispatching notifications:', notifications);

        // Dispatches event for the UI components to pick up locally if they are on the same client
        window.dispatchEvent(new CustomEvent('BOOK_NOTIFICATIONS_UPDATED', { detail: notifications }));
    }

    /**
     * Clean up inactive readers (older than 7 days)
     */
    cleanupInactiveReaders(): void {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        this.activeReaders.forEach((readers, bookId) => {
            const activeReaders = readers.filter(r => r.lastAccessedAt > sevenDaysAgo);

            if (activeReaders.length === 0) {
                this.activeReaders.delete(bookId);
            } else {
                this.activeReaders.set(bookId, activeReaders);
            }
        });
    }
}

// Singleton instance
export const bookUpdateNotificationService = new BookUpdateNotificationService();

// Helper function to use in BookEditor
export async function notifyBookUpdate(
    bookId: string,
    bookTitle: string,
    updateType: BookUpdate['updateType'],
    chapterNumber?: number,
    chapterTitle?: string,
    changes?: string
) {
    const update: BookUpdate = {
        bookId,
        bookTitle,
        updateType,
        chapterNumber,
        chapterTitle,
        changes: changes || '',
        timestamp: new Date(),
    };

    await bookUpdateNotificationService.notifyBookUpdate(update);
}

// Helper function to register active readers (use in AudioPlayer/Library)
export function registerAsActiveReader(userId: string, bookId: string, currentChapter: number) {
    bookUpdateNotificationService.registerActiveReader(userId, bookId, currentChapter);
}
