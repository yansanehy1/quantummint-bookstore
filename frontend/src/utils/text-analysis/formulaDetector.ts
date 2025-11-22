// frontend/src/utils/text-analysis/formulaDetector.ts

export interface MatrixData {
  rows: string[][];
  nestedMatrices: MatrixData[];
  type: 'plain' | 'parenthesized' | 'bracketed';
  dimensions: { m: number; n: number };
}

export interface Formula {
  id: string;
  latex: string;
  spoken: string;
  position: {
    start: number;
    end: number;
  };
  type: 'inline' | 'display';
  matrixData?: MatrixData;
}

export function parseMatrixContentRecursive(content: string): MatrixData {
  let processedContent = content;
  const nestedMatrices: MatrixData[] = [];

  // Recursively find and parse inner matrices
  const innerMatrixRegex = /\\begin\{([pb]?matrix)\}([\s\S]*?)\\end\{\1\}/g;
  let innerMatch;
  let lastIndex = 0;
  let matchResult;

  // Process all nested matrices
  while ((matchResult = innerMatrixRegex.exec(processedContent)) !== null) {
    const innerContent = matchResult[2];
    const nested = parseMatrixContentRecursive(innerContent);
    nestedMatrices.push(nested);
    // Replace inner with placeholder for row splitting
    processedContent = processedContent.replace(
      matchResult[0],
      `[nested_${nestedMatrices.length - 1}]`
    );
    // Reset regex lastIndex due to string modification
    innerMatrixRegex.lastIndex = 0;
  }

  // Parse rows with placeholders
  const rows = processedContent
    .trim()
    .split('\\\\')
    .map(row =>
      row.trim()
        .split('&')
        .map(cell => cell.trim())
        .filter(Boolean)
    )
    .filter(row => row.length > 0); // Remove empty rows

  const m = rows.length;
  const n = rows[0]?.length || 0;

  if (m > 0 && rows.some(row => row.length !== n)) {
    throw new Error('Inconsistent matrix columns');
  }

  return {
    rows,
    nestedMatrices,
    type: innerMatch?.[1]?.includes('p')
      ? 'parenthesized'
      : innerMatch?.[1]?.includes('b')
        ? 'bracketed'
        : 'plain',
    dimensions: { m, n }
  };
}

// Update detectFormulas to handle matrix environments
export function detectFormulas(text: string): Formula[] {
  const formulaPatterns = [
    { regex: /\$\$([^$]+)\$\$/g, type: "display" as const },
    { regex: /\$([^$]+)\$/g, type: "inline" as const },
    { regex: /\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, type: "display" as const },
    { regex: /\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, type: "display" as const },
    { regex: /\\begin\{([pb]?matrix)\}([\s\S]*?)\\end\{\1\}/g, type: "display" as const },
    { regex: /\\begin\{vmatrix\}([\s\S]*?)\\end\{vmatrix\}/g, type: "display" as const },
    { regex: /\\vec\{([^}]+)\}/g, type: "inline" as const },
    { regex: /\\lim_\{([^}]+)\}/g, type: "inline" as const },
    { regex: /\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, type: "display" as const },
    { regex: /\\prod_\{([^}]+)\}\^\{([^}]+)\}/g, type: "display" as const },
    { regex: /\\mathbf\{([^}]+)\}/g, type: "inline" as const },
  ];

  const formulas: Formula[] = [];

  for (const { regex, type } of formulaPatterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      const fullMatch = match[0];
      const content = match[1] || match[2] || fullMatch;
      let matrixData: MatrixData | undefined;

      // Handle matrix environments
      if (fullMatch.includes('matrix') || fullMatch.includes('vmatrix')) {
        try {
          matrixData = parseMatrixContentRecursive(content);
          if (fullMatch.includes('vmatrix')) {
            // Mark as determinant
            matrixData.type = 'bracketed';
          }
        } catch (error) {
          console.warn('Error parsing matrix:', error);
        }
      }

      formulas.push({
        id: `formula-${formulas.length}`,
        latex: content,
        spoken: '', // Will be populated by latexToSpeech
        position: {
          start: match.index,
          end: match.index + fullMatch.length
        },
        type,
        matrixData
      });
    }
  }

  // Process spoken text for all formulas
  return formulas.map(formula => ({
    ...formula,
    spoken: latexToSpeech(formula.latex, formula.matrixData)
  }));
}

// Update latexToSpeech to handle matrices and SSML
export function latexToSpeech(latex: string, matrixData?: MatrixData): string {
  if (matrixData) {
    const { rows, dimensions, nestedMatrices } = matrixData;
    let desc = `a ${dimensions.m} by ${dimensions.n} matrix`;

    if (nestedMatrices.length > 0) {
      desc += ' containing nested matrices. ';
    } else {
      desc += ' with elements: ';
    }

    const rowDescs = rows.map((row, i) => {
      const cellDescs = row.map(cell => {
        if (cell.startsWith('[nested_')) {
          const idx = parseInt(cell.match(/\d+/)?.[0] || '0', 10);
          return `nested matrix: ${latexToSpeech('', nestedMatrices[idx])}`;
        }
        return latexToSpeech(cell); // Recursively process cell content
      });
      return `row ${i + 1}: ${cellDescs.join(', ')}`;
    }).join('; ');

    return desc + rowDescs;
  }

  // Handle other LaTeX elements (keep existing implementation)
  let spoken = latex
    .replace(/\\vec\{([^}]+)\}/g, 'vector $1')
    .replace(/\\det/g, 'determinant of')
    .replace(/\\lim_\{([^}]+)\}([^ ]*)/g, 'limit as $1 of $2')
    .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}([^ ]*)/g, 'sum from $1 to $2 of $3')
    .replace(/\\prod_\{([^}]+)\}\^\{([^}]+)\}([^ ]*)/g, 'product from $1 to $2 of $3')
    .replace(/\\mathbf\{([^}]+)\}/g, 'bold $1')
    .replace(/\\begin\{vmatrix\}([\s\S]*?)\\end\{vmatrix\}/g, 'determinant of $1')
    // ... (keep other existing replacements)
    .trim();

  return spoken;
}