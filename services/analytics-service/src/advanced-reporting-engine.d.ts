export declare class AdvancedReportingEngine {
    private esClient;
    private db;
    private serviceRegistry;
    constructor();
    generateComprehensiveReport(options: {
        reportType: 'financial' | 'user_behavior' | 'content_performance' | 'platform_health';
        timeframe: string;
        filters: any;
        format: 'pdf' | 'csv' | 'json';
        includeCharts: boolean;
    }): Promise<any>;
    private generateFinancialReport;
    private generateUserBehaviorReport;
    private getRevenueMetrics;
    private calculateUserAcquisitionCost;
    private calculateLifetimeValue;
    private performCohortAnalysis;
    private generatePDFReport;
    private generateCSVReport;
    private generateFinancialRecommendations;
    private buildFilters;
    private processRevenueAggregations;
}
