// frontend/src/pages/AudiobookCreator.tsx
import { useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { analyzeText } from '../utils/text-analysis/textAnalyzer';
import { processTextWithSSML } from '../utils/text-analysis/textAnalyzer';
import { detectFormulas } from '../utils/text-analysis/formulaDetector';

// Type definitions
type ProcessedSentence = {
  text: string;
  isFormula: boolean;
  formulas: { content: string; type: 'inline' | 'display' }[];
  narrationText: string;
  grammarIssues?: Array<{
    type: string;
    message: string;
    start: number;
    end: number;
    suggestion?: string;
    severity: 'low' | 'medium' | 'high';
  }>;
};

// Helper components
const GrammarIssuesViewer = ({ issues, onApplySuggestion }: {
  issues: any[],
  onApplySuggestion: (issue: any) => void
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Grammar Issues</h3>
    {issues.length > 0 ? (
      <div className="space-y-4">
        {issues.map((issue, index) => (
          <div key={index} className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">{issue.message}</p>
                {issue.suggestion && (
                  <div className="mt-2">
                    <p className="text-sm text-yellow-700">Suggestion: {issue.suggestion}</p>
                    <button
                      onClick={() => onApplySuggestion(issue)}
                      className="mt-1 text-xs text-yellow-700 hover:text-yellow-900 font-medium"
                    >
                      Apply suggestion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 bg-green-50 rounded-lg">
        <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No grammar issues found</h3>
      </div>
    )}
  </div>
);

const MathIssuesViewer = ({ issues, text }: { issues: any[], text: string }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Math Expressions</h3>
    {issues.length > 0 ? (
      <div className="space-y-4">
        {issues.map((math, index) => (
          <div key={index} className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r">
            <div className="flex items-start">
              {math.result.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900 mb-2">
                  <InlineMath math={math.expression} />
                </div>
                {math.result.isValid ? (
                  <div className="text-sm text-green-700">
                    {math.result.verification || 'Valid math expression'}
                    {math.result.solution && (
                      <div className="mt-1">
                        Result: {JSON.stringify(math.result.solution)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-red-700">
                    Error: {math.result.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Info className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No math expressions found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Use $...$ for inline math and $$...$$ for display math.
        </p>
      </div>
    )}
  </div>
);

const ScienceIssuesViewer = ({ issues, onApplySuggestion }: {
  issues: any[],
  onApplySuggestion: (issue: any) => void
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Scientific Accuracy</h3>
    {issues.length > 0 ? (
      <div className="space-y-4">
        {issues.map((issue, index) => (
          <div
            key={index}
            className={`p-4 border-l-4 rounded-r ${issue.severity === 'high'
                ? 'bg-red-50 border-red-400'
                : issue.severity === 'medium'
                  ? 'bg-yellow-50 border-yellow-400'
                  : 'bg-blue-50 border-blue-400'
              }`}
          >
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{issue.type}</p>
                <p className="text-sm text-gray-700 mt-1">{issue.message}</p>
                {issue.suggestion && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Suggestion: <span className="font-medium">{issue.suggestion}</span>
                    </p>
                    <button
                      onClick={() => onApplySuggestion(issue)}
                      className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Apply suggestion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 bg-green-50 rounded-lg">
        <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No scientific inaccuracies found</h3>
      </div>
    )}
  </div>
);

// Helper function
const processText = (rawText: string): ProcessedSentence[] => {
  const sentences = rawText.match(/[^.!?]+[.!?]|\S+$/g) || [];

  return sentences.map(sentence => {
    const formulas: { content: string; type: 'inline' | 'display' }[] = [];

    let inlineMatch;
    const inlineRegex = /\$([^$]+)\$/g;
    while ((inlineMatch = inlineRegex.exec(sentence)) !== null) {
      formulas.push({
        content: inlineMatch[1],
        type: 'inline'
      });
    }

    let displayMatch;
    const displayRegex = /\$\$([^$]+)\$\$/g;
    while ((displayMatch = displayRegex.exec(sentence)) !== null) {
      formulas.push({
        content: displayMatch[1],
        type: 'display'
      });
    }

    return {
      text: sentence,
      isFormula: formulas.length > 0,
      formulas,
      narrationText: sentence
    };
  });
};

// Main component
export default function AudiobookCreator() {
  const [currentPage, setCurrentPage] = useState({
    rawText: '',
    processedText: '',
    formulas: [] as any[]
  });
  const [processedSentences, setProcessedSentences] = useState<ProcessedSentence[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Awaited<ReturnType<typeof analyzeText>> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'grammar' | 'math' | 'science'>('grammar');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const updateCurrentPage = (updates: Partial<typeof currentPage>) => {
    setCurrentPage(prev => ({ ...prev, ...updates }));
  };

  const handleProcessText = async () => {
    if (!currentPage.rawText.trim() || isAnalyzing) return;

    const text = currentPage.rawText;
    const formulas = detectFormulas(text);
    const processedText = processTextWithSSML(text, formulas);

    setCurrentPage(prev => ({
      ...prev,
      processedText,
      formulas
    }));

    setIsAnalyzing(true);
    try {
      const results = await analyzeText(currentPage.rawText);
      setAnalysisResults(results);

      const sentences = processText(currentPage.rawText);
      sentences.forEach((sentence) => {
        const sentenceStart = currentPage.rawText.indexOf(sentence.text);
        if (sentenceStart >= 0) {
          const sentenceEnd = sentenceStart + sentence.text.length;
          sentence.grammarIssues = results.grammarIssues.filter(issue =>
            issue.start >= sentenceStart && issue.end <= sentenceEnd
          );
        }
      });

      setProcessedSentences(sentences);
      setActiveTab('preview');
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Audiobook Creator</h1>

      <div className="mb-4">
        <textarea
          className="w-full p-4 border rounded-lg"
          rows={10}
          value={currentPage.rawText}
          onChange={(e) => updateCurrentPage({ rawText: e.target.value })}
          placeholder="Enter your text here..."
        />
      </div>

      <button
        onClick={handleProcessText}
        disabled={!currentPage.rawText.trim() || isAnalyzing}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isAnalyzing ? 'Processing...' : 'Process & Analyze Text'}
      </button>

      {activeTab === 'preview' && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveAnalysisTab('grammar')}
                className={`px-4 py-2 rounded-md ${activeAnalysisTab === 'grammar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Grammar
              </button>
              <button
                onClick={() => setActiveAnalysisTab('math')}
                className={`px-4 py-2 rounded-md ${activeAnalysisTab === 'math'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Math
              </button>
              <button
                onClick={() => setActiveAnalysisTab('science')}
                className={`px-4 py-2 rounded-md ${activeAnalysisTab === 'science'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Science
              </button>
            </div>
          </div>

          {isAnalyzing ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3">Analyzing text...</span>
            </div>
          ) : analysisResults ? (
            <div className="space-y-6">
              {activeAnalysisTab === 'grammar' && (
                <GrammarIssuesViewer
                  issues={analysisResults.grammarIssues}
                  onApplySuggestion={(suggestion) => {
                    const newText = currentPage.rawText.substring(0, suggestion.start) +
                      (suggestion.suggestion || '') +
                      currentPage.rawText.substring(suggestion.end);
                    updateCurrentPage({ rawText: newText });
                  }}
                />
              )}

              {activeAnalysisTab === 'math' && (
                <MathIssuesViewer
                  issues={analysisResults.mathIssues}
                  text={currentPage.rawText}
                />
              )}

              {activeAnalysisTab === 'science' && (
                <ScienceIssuesViewer
                  issues={analysisResults.scientificIssues}
                  onApplySuggestion={(suggestion) => {
                    const newText = currentPage.rawText.substring(0, suggestion.start) +
                      (suggestion.suggestion || '') +
                      currentPage.rawText.substring(suggestion.end);
                    updateCurrentPage({ rawText: newText });
                  }}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No analysis results available. Click "Process & Analyze Text" to analyze your content.
            </div>
          )}
        </div>
      )}
    </div>
  );
}