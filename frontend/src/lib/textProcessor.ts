export interface Formula {
  id: string;
  latex: string;
  mathml?: string;
  spoken: string;
  position: { start: number; end: number };
}

export interface ProcessedSentence {
  id: string;
  text: string;
  originalText: string;
  containsFormula: boolean;
  formulas: Formula[];
  speechText: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Detect sentences in text using regex
 * Handles common sentence endings: . ! ?
 */
export function detectSentences(text: string): string[] {
  const sentenceRegex = /[^.!?]*[.!?]+/g;
  const matches = text.match(sentenceRegex) || [];
  return matches.map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * Detect LaTeX formulas in text
 * Supports: $...$ (inline), $$...$$ (display), \(...\), \[...\]
 */
export function detectFormulas(text: string): Formula[] {
  const formulas: Formula[] = [];
  const formulaPatterns = [
    { regex: /\$\$([^\$]+)\$\$/g, type: "display" },
    { regex: /\$([^\$]+)\$/g, type: "inline" },
    { regex: /\\\(([^(]+)\\\)/g, type: "inline" },
    { regex: /\\\[([^\]]+)\\\]/g, type: "display" },
  ];

  for (const pattern of formulaPatterns) {
    let match;
    const regex = new RegExp(pattern.regex.source, "g");
    while ((match = regex.exec(text)) !== null) {
      const latex = match[1];
      const position = { start: match.index, end: match.index + match[0].length };
      formulas.push({
        id: `formula-${Date.now()}-${Math.random()}`,
        latex,
        spoken: latexToSpeech(latex),
        position,
      });
    }
  }

  return formulas.sort((a, b) => a.position.start - b.position.start);
}

/**
 * Convert LaTeX notation to spoken text
 */
export function latexToSpeech(latex: string): string {
  let spoken = latex.trim();

  const greekLetters: Record<string, string> = {
    "\\alpha": "alpha",
    "\\beta": "beta",
    "\\gamma": "gamma",
    "\\delta": "delta",
    "\\epsilon": "epsilon",
    "\\zeta": "zeta",
    "\\eta": "eta",
    "\\theta": "theta",
    "\\iota": "iota",
    "\\kappa": "kappa",
    "\\lambda": "lambda",
    "\\mu": "mu",
    "\\nu": "nu",
    "\\xi": "xi",
    "\\omicron": "omicron",
    "\\pi": "pi",
    "\\rho": "rho",
    "\\sigma": "sigma",
    "\\tau": "tau",
    "\\upsilon": "upsilon",
    "\\phi": "phi",
    "\\chi": "chi",
    "\\psi": "psi",
    "\\omega": "omega",
  };

  for (const [k, name] of Object.entries(greekLetters)) {
    spoken = spoken.replace(new RegExp(k, "g"), name);
  }

  spoken = spoken.replace(/\^(\d+)/g, (_m, exp) => {
    const powers: Record<string, string> = {
      "2": "squared",
      "3": "cubed",
      "4": "to the fourth",
      "5": "to the fifth",
    };
    return powers[exp] || `to the ${exp}`;
  });

  spoken = spoken.replace(/_([a-zA-Z0-9])/g, "sub $1");
  spoken = spoken.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 over $2");
  spoken = spoken.replace(/\\int/g, "integral");
  spoken = spoken.replace(/\\sum/g, "sum");
  spoken = spoken.replace(/\\prod/g, "product");
  spoken = spoken.replace(/_\{([^}]+)\}\^?\{?([^}]*)\}?/g, "from $1 to $2");
  spoken = spoken.replace(/\\times/g, "times");
  spoken = spoken.replace(/\\div/g, "divided by");
  spoken = spoken.replace(/\\pm/g, "plus or minus");
  spoken = spoken.replace(/\\approx/g, "approximately");
  spoken = spoken.replace(/\\neq/g, "not equal to");
  spoken = spoken.replace(/\\leq/g, "less than or equal to");
  spoken = spoken.replace(/\\geq/g, "greater than or equal to");
  spoken = spoken.replace(/\\infty/g, "infinity");
  spoken = spoken.replace(/\{/g, "");
  spoken = spoken.replace(/\}/g, "");
  spoken = spoken.replace(/\s+/g, " ").trim();
  return spoken;
}

/**
 * Replace formulas in text with spoken equivalents
 */
export function replaceFormulasWithSpeech(text: string, formulas: Formula[]): string {
  let result = text;
  const sortedFormulas = [...formulas].sort((a, b) => b.position.start - a.position.start);
  for (const formula of sortedFormulas) {
    const before = result.substring(0, formula.position.start);
    const after = result.substring(formula.position.end);
    result = before + formula.spoken + after;
  }
  return result;
}

/**
 * Process raw text into sentences with formula detection and speech conversion
 */
export function processText(rawText: string): ProcessedSentence[] {
  const sentences = detectSentences(rawText);
  const allFormulas = detectFormulas(rawText);

  let currentIndex = 0;
  const processed: ProcessedSentence[] = [];
  for (const sentence of sentences) {
    const sentenceStart = rawText.indexOf(sentence, currentIndex);
    const sentenceEnd = sentenceStart + sentence.length;
    const sentenceFormulas = allFormulas.filter((f) => f.position.start >= sentenceStart && f.position.end <= sentenceEnd);

    let speechText = sentence;
    for (const formula of sentenceFormulas) {
      const relativeStart = formula.position.start - sentenceStart;
      const relativeEnd = formula.position.end - sentenceStart;
      const before = speechText.substring(0, relativeStart);
      const after = speechText.substring(relativeEnd);
      speechText = before + formula.spoken + after;
    }

    processed.push({
      id: `sentence-${Date.now()}-${Math.random()}`,
      text: sentence,
      originalText: sentence,
      containsFormula: sentenceFormulas.length > 0,
      formulas: sentenceFormulas,
      speechText: speechText.trim(),
      startIndex: sentenceStart,
      endIndex: sentenceEnd,
    });

    currentIndex = sentenceEnd;
  }

  return processed;
}

/**
 * Validate LaTeX formula syntax
 */
export function isValidLatex(latex: string): boolean {
  let braceCount = 0;
  for (const char of latex) {
    if (char === "{") braceCount++;
    if (char === "}") braceCount--;
    if (braceCount < 0) return false;
  }
  return braceCount === 0;
}

/**
 * Extract text without formulas (for plain text display)
 */
export function stripFormulas(text: string): string {
  return text
    .replace(/\$\$[^\$]+\$\$/g, "")
    .replace(/\$[^\$]+\$/g, "")
    .replace(/\\\([^\)]+\\\)/g, "")
    .replace(/\\\[[^\]]+\\\]/g, "");
}
