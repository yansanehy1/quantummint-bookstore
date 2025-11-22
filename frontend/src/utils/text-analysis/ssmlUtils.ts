// frontend/src/utils/text-analysis/ssmlUtils.ts

export function wrapInSSML(text: string): string {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis">${text}</speak>`;
}

export function addPauses(text: string): string {
  return text
    .replace(/([.,;])/g, '$1<break time="200ms"/>')
    .replace(/\?/g, '?<break time="300ms"/>')
    .replace(/!/g, '!<break time="300ms"/>');
}

export function formatFormulaForSSML(formula: string, isMatrix: boolean = false): string {
  const rate = isMatrix ? '70%' : '80%';
  return `<prosody rate="${rate}">the formula: <emphasis level="moderate">${formula}</emphasis></prosody><break time="300ms"/>`;
}