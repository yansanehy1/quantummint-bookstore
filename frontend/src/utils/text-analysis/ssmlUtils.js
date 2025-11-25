"use strict";
// frontend/src/utils/text-analysis/ssmlUtils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapInSSML = wrapInSSML;
exports.addPauses = addPauses;
exports.formatFormulaForSSML = formatFormulaForSSML;
function wrapInSSML(text) {
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis">${text}</speak>`;
}
function addPauses(text) {
    return text
        .replace(/([.,;])/g, '$1<break time="200ms"/>')
        .replace(/\?/g, '?<break time="300ms"/>')
        .replace(/!/g, '!<break time="300ms"/>');
}
function formatFormulaForSSML(formula, isMatrix = false) {
    const rate = isMatrix ? '70%' : '80%';
    return `<prosody rate="${rate}">the formula: <emphasis level="moderate">${formula}</emphasis></prosody><break time="300ms"/>`;
}
