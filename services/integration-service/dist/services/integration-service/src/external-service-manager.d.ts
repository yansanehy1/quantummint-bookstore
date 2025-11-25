interface PaymentProvider {
    createPaymentIntent(amount: number, currency: string, metadata: any): Promise<PaymentIntent>;
    handleWebhook?(payload: any, signature: string): Promise<WebhookResult>;
}
interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    clientSecret?: string;
}
interface WebhookResult {
    processed: boolean;
    event: string;
    error?: string;
}
interface SMSMessage {
    to: string;
    message: string;
    from?: string;
}
interface SMSResult {
    success: boolean;
    messageId?: string;
    error?: string;
}
interface EmailMessage {
    to: string | string[];
    subject: string;
    body: string;
    from?: string;
    attachments?: any[];
}
interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}
interface AnalyticsEvent {
    name: string;
    userId: string;
    properties: Record<string, any>;
}
interface FileUpload {
    data: Buffer;
    filename: string;
    contentType: string;
    metadata?: Record<string, any>;
}
interface FileUploadResult {
    success: boolean;
    url?: string;
    error?: string;
}
interface AIAnalysisResult {
    success: boolean;
    analysis: any;
    confidence: number;
    error?: string;
}
interface WebhookConfig {
    id: string;
    url: string;
    events: string[];
}
interface ServiceHealth {
    status: 'healthy' | 'unhealthy' | 'unknown';
    latency: number;
    lastChecked: Date;
    error?: string;
}
interface SMSCampaign {
    provider: string;
    template: string;
    recipients: Array<{
        phone: string;
        vars: Record<string, any>;
    }>;
    senderId: string;
}
interface BulkOperationResult {
    total: number;
    successful: number;
    failed: number;
    details: any[];
}
export declare class ExternalServiceManager {
    private serviceRegistry;
    private webhookClients;
    private db;
    constructor();
    private initializeWebhooks;
    initializePaymentProvider(provider: string, config: any): Promise<PaymentProvider>;
    sendSMS(provider: string, message: SMSMessage): Promise<SMSResult>;
    sendEmail(provider: string, email: EmailMessage): Promise<EmailResult>;
    trackEvent(service: string, event: AnalyticsEvent): Promise<void>;
    uploadFile(provider: string, file: FileUpload): Promise<FileUploadResult>;
    analyzeContentWithAI(service: string, content: string, analysisType: string): Promise<AIAnalysisResult>;
    registerWebhook(webhook: WebhookConfig): Promise<void>;
    triggerWebhook(webhookId: string, payload: any): Promise<void>;
    private makeAPICallWithCircuitBreaker;
    private analyzeWithOpenAI;
    private trackGoogleAnalytics;
    checkServiceHealth(service: string): Promise<ServiceHealth>;
    private checkStripeHealth;
    updateServiceConfig(service: string, config: any): Promise<void>;
    private reinitializeService;
    processBulkSMSCampaign(campaign: SMSCampaign): Promise<BulkOperationResult>;
    private personalizeMessage;
    private delay;
    private getAnalysisPrompt;
    private getCircuitBreaker;
    private recordFailure;
    private getSMSService;
    private getEmailService;
    private getStorageService;
}
export {};
