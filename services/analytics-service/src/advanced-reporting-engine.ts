import { Client } from '@elastic/elasticsearch';
import { createObjectCsvStringifier } from 'csv-writer';
import PDFDocument from 'pdfkit';
import { ServiceRegistryClient } from '../../../shared/src/utils/service-registry-client';

export class AdvancedReportingEngine {
  private esClient: Client;
  private db: any;
  private serviceRegistry: ServiceRegistryClient;

  constructor() {
    this.esClient = new Client({ node: process.env.ELASTICSEARCH_URL });
    this.serviceRegistry = new ServiceRegistryClient();
  }

  async generateComprehensiveReport(options: {
    reportType: 'financial' | 'user_behavior' | 'content_performance' | 'platform_health';
    timeframe: string;
    filters: any;
    format: 'pdf' | 'csv' | 'json';
    includeCharts: boolean;
  }) {
    const { reportType, timeframe, filters, format, includeCharts } = options;

    // Gather data based on report type
    let reportData;
    switch (reportType) {
      case 'financial':
        reportData = await this.generateFinancialReport(timeframe, filters);
        break;
      case 'user_behavior':
        reportData = await this.generateUserBehaviorReport(timeframe, filters);
        break;
      case 'content_performance':
        reportData = await this.generateContentPerformanceReport(timeframe, filters);
        break;
      case 'platform_health':
        reportData = await this.generatePlatformHealthReport(timeframe, filters);
        break;
    }

    // Generate output in requested format
    switch (format) {
      case 'pdf':
        return await this.generatePDFReport(reportData, includeCharts);
      case 'csv':
        return await this.generateCSVReport(reportData);
      case 'json':
        return reportData;
    }
  }

  private async generateFinancialReport(timeframe: string, filters: any) {
    const [
      revenueMetrics,
      expenseMetrics,
      userAcquisitionCost,
      lifetimeValue,
      paymentAnalytics,
      forecasting
    ] = await Promise.all([
      this.getRevenueMetrics(timeframe, filters),
      this.getExpenseMetrics(timeframe, filters),
      this.calculateUserAcquisitionCost(timeframe),
      this.calculateLifetimeValue(timeframe),
      this.getPaymentAnalytics(timeframe),
      this.generateFinancialForecast(timeframe)
    ]);

    return {
      summary: {
        timeframe,
        totalRevenue: revenueMetrics.total,
        totalExpenses: expenseMetrics.total,
        netProfit: revenueMetrics.total - expenseMetrics.total,
        profitMargin: ((revenueMetrics.total - expenseMetrics.total) / revenueMetrics.total) * 100
      },
      revenueMetrics,
      expenseMetrics,
      userEconomics: {
        acquisitionCost: userAcquisitionCost,
        lifetimeValue,
        roi: lifetimeValue / userAcquisitionCost
      },
      paymentAnalytics,
      forecasting,
      recommendations: this.generateFinancialRecommendations(revenueMetrics, expenseMetrics)
    };
  }

  private async generateUserBehaviorReport(timeframe: string, filters: any) {
    const [
      engagementMetrics,
      retentionAnalysis,
      segmentation,
      funnelAnalysis,
      cohortAnalysis
    ] = await Promise.all([
      this.getEngagementMetrics(timeframe),
      this.analyzeUserRetention(timeframe),
      this.segmentUsers(timeframe),
      this.analyzeUserFunnel(timeframe),
      this.performCohortAnalysis(timeframe)
    ]);

    return {
      engagementMetrics,
      retentionAnalysis,
      userSegments: segmentation,
      funnelAnalysis,
      cohortAnalysis,
      behavioralInsights: this.generateBehavioralInsights(engagementMetrics, retentionAnalysis)
    };
  }

  private async getRevenueMetrics(timeframe: string, filters: any) {
    const revenueData = await this.esClient.search({
      index: 'transactions',
      body: {
        query: {
          bool: {
            must: [
              { term: { 'type': 'purchase' } },
              { term: { 'status': 'completed' } },
              { range: { 'created_at': { gte: `now-${timeframe}/d` } } }
            ],
            filter: this.buildFilters(filters)
          }
        },
        aggs: {
          daily_revenue: {
            date_histogram: {
              field: 'created_at',
              calendar_interval: 'day'
            },
            aggs: {
              amount: { sum: { field: 'amount' } }
            }
          },
          by_currency: {
            terms: { field: 'currency' },
            aggs: {
              total: { sum: { field: 'amount' } }
            }
          },
          by_category: {
            terms: { field: 'book_category' },
            aggs: {
              total: { sum: { field: 'amount' } }
            }
          },
          by_payment_method: {
            terms: { field: 'payment_method' },
            aggs: {
              total: { sum: { field: 'amount' } }
            }
          }
        }
      }
    });

    return this.processRevenueAggregations(revenueData.aggregations);
  }

  private async calculateUserAcquisitionCost(timeframe: string): Promise<number> {
    const [marketingCosts, newUsers] = await Promise.all([
      this.db.marketingExpenses.getTotal(timeframe),
      this.db.users.getNewCount(timeframe)
    ]);

    return newUsers > 0 ? marketingCosts / newUsers : 0;
  }

  private async calculateLifetimeValue(timeframe: string): Promise<number> {
    const cohortData = await this.performCohortAnalysis(timeframe);
    
    const totalRevenue = cohortData.cohorts.reduce((sum: number, cohort: any) => 
      sum + cohort.metrics.totalRevenue, 0
    );
    const totalUsers = cohortData.cohorts.reduce((sum: number, cohort: any) => 
      sum + cohort.userCount, 0
    );

    return totalUsers > 0 ? totalRevenue / totalUsers : 0;
  }

  private async performCohortAnalysis(timeframe: string) {
    const cohorts = await this.db.users.getCohorts(timeframe);
    
    const cohortAnalysis = cohorts.map((cohort: any) => ({
      cohort: cohort.month,
      userCount: cohort.userCount,
      metrics: {
        retentionRates: await this.calculateCohortRetention(cohort.month, timeframe),
        totalRevenue: await this.getCohortRevenue(cohort.month),
        averageOrderValue: await this.getCohortAOV(cohort.month),
        lifetimeValue: await this.getCohortLTV(cohort.month)
      }
    }));

    return { cohorts: cohortAnalysis };
  }

  private async generatePDFReport(reportData: any, includeCharts: boolean): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add header
      doc.fontSize(20).text('QuantumMin Analytics Report', { align: 'center' });
      doc.moveDown();
      
      // Add summary section
      doc.fontSize(16).text('Executive Summary');
      doc.moveDown();
      doc.fontSize(12).text(this.generateExecutiveSummary(reportData));
      doc.moveDown();

      // Add detailed sections based on report type
      if (reportData.revenueMetrics) {
        this.addFinancialSection(doc, reportData);
      }
      
      if (reportData.engagementMetrics) {
        this.addUserBehaviorSection(doc, reportData);
      }

      // Add charts if requested
      if (includeCharts) {
        doc.addPage().text('Charts and visualizations would be embedded here...');
      }

      // Add recommendations
      doc.addPage().fontSize(16).text('Recommendations');
      doc.moveDown();
      doc.fontSize(12).text(this.generateRecommendationsText(reportData));

      doc.end();
    });
  }

  private async generateCSVReport(reportData: any): Promise<string> {
    const flattenedData = this.flattenReportData(reportData);
    
    const csvStringifier = createObjectCsvStringifier({
      header: Object.keys(flattenedData[0] || {}).map(key => ({ id: key, title: key }))
    });

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(flattenedData);
  }

  private generateFinancialRecommendations(revenueMetrics: any, expenseMetrics: any): string[] {
    const recommendations = [];
    
    if (expenseMetrics.operatingRatio > 0.7) {
      recommendations.push('Consider optimizing operational costs to improve profit margins');
    }
    
    if (revenueMetrics.growthRate < 0.1) {
      recommendations.push('Explore new revenue streams or marketing channels to accelerate growth');
    }
    
    if (revenueMetrics.concentrationRisk > 0.8) {
      recommendations.push('Diversify revenue sources to reduce dependency on top-performing categories');
    }
    
    return recommendations;
  }

  private buildFilters(filters: any): any[] {
    const esFilters = [];
    
    if (filters.category) {
      esFilters.push({ term: { 'book_category': filters.category } });
    }
    
    if (filters.paymentMethod) {
      esFilters.push({ term: { 'payment_method': filters.paymentMethod } });
    }
    
    if (filters.minAmount) {
      esFilters.push({ range: { 'amount': { gte: filters.minAmount } } });
    }
    
    return esFilters;
  }

  private processRevenueAggregations(aggs: any) {
    return {
      daily: aggs.daily_revenue.buckets.map((b: any) => ({
        date: b.key_as_string,
        revenue: b.amount.value
      })),
      byCurrency: aggs.by_currency.buckets.map((b: any) => ({
        currency: b.key,
        amount: b.total.value
      })),
      byCategory: aggs.by_category.buckets.map((b: any) => ({
        category: b.key,
        amount: b.total.value
      })),
      byPaymentMethod: aggs.by_payment_method.buckets.map((b: any) => ({
        method: b.key,
        amount: b.total.value
      }))
    };
  }
}