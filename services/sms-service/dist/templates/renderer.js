"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = renderTemplate;
async function renderTemplate(templateId, locale, variables) {
    // Simple template engine for now
    if (templateId === "gift") {
        return `Hi ${variables.name}, you've received a book gift: "${variables.title}". ${variables.message}`;
    }
    return variables.message || "";
}
