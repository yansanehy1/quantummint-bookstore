"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomatedModerationEngine = void 0;
requiredAction: 'approve' | 'reject' | 'review' | 'none';
breakdown: {
    text ?  : TextModerationResult;
    image ?  : ImageModerationResult;
    spam ?  : SpamDetectionResult;
    plagiarism ?  : PlagiarismResult;
    behavior ?  : UserBehaviorAnalysis;
}
;
class AutomatedModerationEngine {
    constructor() {
        // Moderation thresholds
        this.THRESHOLDS = {
            toxicity: 0.7,
            spam: 0.8,
            inappropriate: 0.6,
            plagiarism: 0.9
        };
        this.languageClient = new GoogleCloudLanguage();
        this.visionClient = new GoogleCloudVision();
        this.esClient = new Client({ node: process.env.ELASTICSEARCH_URL });
        this.serviceRegistry = new ServiceRegistryClient();
    }
    async moderateContent(content) {
        const moderationTasks = [];
        // Text-based moderation
        if (content.content) {
            moderationTasks.push(this.moderateText(content.content), this.detectSpam(content.content), this.checkPlagiarism(content.content), this.analyzeSentiment(content.content));
        }
        // Image moderation
        if (content.images && content.images.length > 0) {
            moderationTasks.push(...content.images.map(img => this.moderateImage(img)));
        }
        // User behavior analysis
        if (content.authorId) {
            moderationTasks.push(this.analyzeUserBehavior(content.authorId));
        }
        const results = await Promise.allSettled(moderationTasks);
        const moderationResult = this.aggregateResults(results, content);
        // Take action based on severity
        await this.executeModerationAction(moderationResult, content);
        return moderationResult;
    }
    async moderateText(text) {
        try {
            const [classification] = await this.languageClient.classifyText({
                document: { content: text, type: 'PLAIN_TEXT' }
            });
            const toxicityScore = await this.detectToxicity(text);
            const ruleViolations = this.applyContentRules(text);
            return {
                toxicity: toxicityScore,
                categories: classification.categories || [],
                ruleViolations,
                flags: this.calculateFlags(toxicityScore, ruleViolations)
            };
        }
        catch (error) {
            console.error('Text moderation failed:', error);
            return { toxicity: 0, categories: [], ruleViolations: [], flags: [] };
        }
    }
    async detectToxicity(text) {
        const response = await fetch('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PERSPECTIVE_API_KEY}`
            },
            body: JSON.stringify({
                comment: { text },
                requestedAttributes: {
                    TOXICITY: {},
                    SEVERE_TOXICITY: {},
                    IDENTITY_ATTACK: {},
                    INSULT: {},
                    PROFANITY: {},
                    THREAT: {}
                },
                languages: ['en']
            })
        });
        const data = await response.json();
        return data.attributeScores.TOXICITY.summaryScore.value;
    }
    getContentRules() {
        return [
            {
                name: 'personal_information',
                pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
                severity: 'high'
            },
            {
                name: 'financial_information',
                pattern: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b|\b\d{3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{3}\b/g,
                severity: 'high'
            },
            {
                name: 'spam_indicators',
                pattern: /\b(buy now|click here|limited time|special offer|act fast)\b/gi,
                severity: 'medium'
            },
            {
                name: 'inappropriate_language',
                pattern: /\b(profanity1|profanity2|profanity3)\b/gi,
                severity: 'high'
            }
        ];
    }
    applyContentRules(text) {
        const violations = [];
        const rules = this.getContentRules();
        for (const rule of rules) {
            const matches = text.match(rule.pattern) || [];
            if (matches.length > 0) {
                violations.push({
                    rule: rule.name,
                    matches: matches,
                    severity: rule.severity
                });
            }
        }
        return violations;
    }
    async moderateImage(imageData) {
        try {
            const [safeSearch] = await this.visionClient.safeSearchDetection(this.isBase64(imageData) ? { image: { content: imageData } } : { image: { source: { imageUri: imageData } } });
            const [labelDetection] = await this.visionClient.labelDetection(this.isBase64(imageData) ? { image: { content: imageData } } : { image: { source: { imageUri: imageData } } });
            return {
                safe: this.evaluateImageSafety(safeSearch),
                safeSearch,
                labels: labelDetection.labelAnnotations,
                flags: this.calculateImageFlags(safeSearch)
            };
        }
        catch (error) {
            console.error('Image moderation failed:', error);
            return { safe: true, safeSearch: {}, labels: [], flags: [] };
        }
    }
    isBase64(str) {
        return /^data:image\/[a-z]+;base64,/.test(str);
    }
    evaluateImageSafety(safeSearch) {
        return safeSearch.adult !== 'VERY_LIKELY' &&
            safeSearch.violence !== 'VERY_LIKELY' &&
            safeSearch.racy !== 'VERY_LIKELY';
    }
    async checkPlagiarism(text) {
        const searchResult = await this.esClient.search({
            index: 'books,reviews',
            body: {
                query: {
                    more_like_this: {
                        fields: ['content', 'title'],
                        like: text,
                        min_term_freq: 1,
                        max_query_terms: 25
                    }
                }
            }
        });
        const matches = searchResult.hits.hits
            .filter((hit) => hit._score > this.THRESHOLDS.plagiarism)
            .map((hit) => ({
            source: hit._source,
            score: hit._score,
            id: hit._id
        }));
        return {
            isPlagiarized: matches.length > 0,
            matches,
            confidence: matches.length > 0 ? Math.max(...matches.map((m) => m.score)) : 0
        };
    }
    async detectSpam(text) {
        const features = this.extractSpamFeatures(text);
        const spamScore = this.calculateSpamScore(features);
        return {
            isSpam: spamScore > this.THRESHOLDS.spam,
            score: spamScore,
            features
        };
    }
    extractSpamFeatures(text) {
        const words = text.split(/\s+/);
        const sentences = text.split(/[.!?]+/);
        return {
            length: text.length,
            wordCount: words.length,
            sentenceCount: sentences.length,
            avgWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
            avgSentenceLength: words.length / sentences.length,
            capitalRatio: (text.replace(/[^A-Z]/g, '').length / text.length) || 0,
            linkCount: (text.match(/https?:\/\/[^\s]+/g) || []).length,
            spamKeywords: this.countSpamKeywords(text)
        };
    }
    countSpamKeywords(text) {
        const spamKeywords = ['free', 'win', 'cash', 'prize', 'offer', 'limited', 'urgent'];
        const lowercaseText = text.toLowerCase();
        return spamKeywords.reduce((count, keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            return count + (lowercaseText.match(regex) || []).length;
        }, 0);
    }
    calculateSpamScore(features) {
        const weights = {
            avgWordLength: 0.1,
            avgSentenceLength: 0.1,
            capitalRatio: 0.2,
            linkCount: 0.3,
            spamKeywords: 0.3
        };
        return ((features.avgWordLength > 15 ? weights.avgWordLength : 0) +
            (features.avgSentenceLength > 30 ? weights.avgSentenceLength : 0) +
            (features.capitalRatio > 0.3 ? weights.capitalRatio : 0) +
            (features.linkCount > 2 ? weights.linkCount : 0) +
            (features.spamKeywords / 10) * weights.spamKeywords);
    }
    async analyzeUserBehavior(userId) {
        const userActions = await this.db.userActions.getRecent(userId, '30d');
        const moderationHistory = await this.db.moderationHistory.getByUser(userId);
        return {
            trustScore: this.calculateTrustScore(userActions, moderationHistory),
            violationHistory: moderationHistory.filter((m) => m.action === 'violation'),
            postingFrequency: this.calculatePostingFrequency(userActions),
            behaviorPatterns: this.identifyBehaviorPatterns(userActions)
        };
    }
    calculateTrustScore(userActions, moderationHistory) {
        const baseScore = 0.5;
        const positiveActions = userActions.filter(a => a.type === 'positive').length;
        const violations = moderationHistory.filter(m => m.action === 'violation').length;
        let score = baseScore;
        score += (positiveActions * 0.1);
        score -= (violations * 0.2);
        return Math.max(0, Math.min(1, score));
    }
    calculatePostingFrequency(userActions) {
        const posts = userActions.filter(a => a.type === 'post');
        if (posts.length < 2)
            return 0;
        const timestamps = posts.map(p => new Date(p.timestamp).getTime());
        const timeDiffs = timestamps.slice(1).map((t, i) => t - timestamps[i]);
        return timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length / (1000 * 60 * 60); // Average hours between posts
    }
    identifyBehaviorPatterns(userActions) {
        const patterns = [];
        // Check for rapid posting
        const postingFrequency = this.calculatePostingFrequency(userActions);
        if (postingFrequency < 1) { // Less than 1 hour between posts
            patterns.push({ type: 'rapid_posting', severity: 'medium' });
        }
        // Check for repeated content
        const contentCounts = new Map();
        userActions.forEach(action => {
            if (action.content) {
                contentCounts.set(action.content, (contentCounts.get(action.content) || 0) + 1);
            }
        });
        if (Array.from(contentCounts.values()).some(count => count > 3)) {
            patterns.push({ type: 'repeated_content', severity: 'high' });
        }
        return patterns;
    }
    aggregateResults(results, content) {
        const aggregated = {
            approved: true,
            confidence: 1.0,
            flags: [],
            requiredAction: 'none',
            breakdown: {}
        };
        for (const result of results) {
            if (result.status === 'fulfilled') {
                const value = result.value;
                if (value.toxicity !== undefined) {
                    aggregated.breakdown.text = value;
                    if (value.toxicity > this.THRESHOLDS.toxicity) {
                        aggregated.approved = false;
                        aggregated.flags.push('toxic_content');
                    }
                }
                if (value.safe !== undefined && !value.safe) {
                    aggregated.approved = false;
                    aggregated.flags.push('inappropriate_image');
                }
                if (value.isSpam !== undefined && value.isSpam) {
                    aggregated.approved = false;
                    aggregated.flags.push('spam');
                }
                if (value.isPlagiarized !== undefined && value.isPlagiarized) {
                    aggregated.approved = false;
                    aggregated.flags.push('plagiarism');
                }
            }
        }
        if (!aggregated.approved) {
            if (aggregated.flags.includes('toxic_content') || aggregated.flags.includes('inappropriate_image')) {
                aggregated.requiredAction = 'reject';
            }
            else if (aggregated.flags.includes('spam') || aggregated.flags.includes('plagiarism')) {
                aggregated.requiredAction = 'review';
            }
        }
        return aggregated;
    }
    async executeModerationAction(result, content) {
        switch (result.requiredAction) {
            case 'reject':
                await this.rejectContent(content, result);
                break;
            case 'review':
                await this.flagForReview(content, result);
                break;
            case 'none':
                await this.approveContent(content, result);
                break;
        }
        await this.db.moderationLogs.create({
            contentId: content.id,
            contentType: content.type,
            authorId: content.authorId,
            result,
            action: result.requiredAction,
            timestamp: new Date()
        });
    }
    async rejectContent(content, result) {
        // Implementation of content rejection logic
        await this.db.content.updateStatus(content.id, 'rejected');
        // Notify user
        const notificationService = await this.serviceRegistry.discover('notification-service');
        await fetch(`${notificationService[0].serviceUrl}/notifications/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'content_rejected',
                userId: content.authorId,
                data: {
                    contentId: content.id,
                    contentType: content.type,
                    reason: result.flags.join(', ')
                }
            })
        });
    }
    async flagForReview(content, result) {
        await this.db.moderationTickets.create({
            contentId: content.id,
            contentType: content.type,
            authorId: content.authorId,
            reason: result.flags.join(', '),
            priority: this.calculateReviewPriority(result),
            status: 'open'
        });
        const notificationService = await this.serviceRegistry.discover('notification-service');
        await fetch(`${notificationService[0].serviceUrl}/notifications/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'moderation_review_required',
                target: 'moderators',
                data: {
                    contentId: content.id,
                    contentType: content.type,
                    flags: result.flags,
                    priority: this.calculateReviewPriority(result)
                }
            })
        });
    }
    async approveContent(content, result) {
        await this.db.content.updateStatus(content.id, 'approved');
    }
    calculateReviewPriority(result) {
        const severityScores = {
            'toxic_content': 3,
            'inappropriate_image': 3,
            'spam': 2,
            'plagiarism': 2
        };
        const totalScore = result.flags.reduce((score, flag) => score + (severityScores[flag] || 1), 0);
        if (totalScore >= 5)
            return 'high';
        if (totalScore >= 3)
            return 'medium';
        return 'low';
    }
    async trainModerationModel(feedbackData) {
        const trainingData = feedbackData.map(f => ({
            features: this.extractFeatures(f.content),
            label: f.correct ? 'approved' : 'rejected'
        }));
        await fetch(`${process.env.ML_SERVICE_URL}/train`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trainingData })
        });
    }
    extractFeatures(content) {
        // Implementation of feature extraction for ML training
        return {
            textLength: content.content?.length || 0,
            hasImages: content.images?.length > 0,
            authorTrustScore: content.authorId ? this.calculateTrustScore([], []) : 0,
            // Add more features as needed
        };
    }
}
exports.AutomatedModerationEngine = AutomatedModerationEngine;
