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

        // TODO: Replace with actual notification service (WebSocket, Push Notifications, Email)
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

        // Send notifications via WebSocket/Push/Email
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
     * Send notifications to users (placeholder for actual implementation)
     */
    private async sendNotifications(notifications: any[]): Promise<void> {
        // TODO: Implement actual notification delivery
        // Options:
        // 1. WebSocket: Real-time push to connected clients
        // 2. Push Notifications: Browser/mobile push notifications
        // 3. Email: Send email notifications
        // 4. In-app: Store in database for in-app notification center

        console.log('Sending notifications:', notifications);

        // Example WebSocket implementation:
        // notifications.forEach(({ userId, notification }) => {
        //   const userSocket = this.getWebSocketConnection(userId);
        //   if (userSocket) {
        //     userSocket.send(JSON.stringify({
        //       type: 'BOOK_UPDATE',
        //       payload: notification,
        //     }));
        //   }
        // });

        // Example API call to store notifications:
        // await fetch('/api/notifications', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ notifications }),
        // });
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
