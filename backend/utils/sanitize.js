/**
 * Strip HTML tags and normalize whitespace for user-supplied text.
 */
function stripHtml(value) {
    if (typeof value !== 'string') return '';
    return value.replace(/<[^>]*>/g, '');
}

function sanitizeText(value, maxLength = 2000) {
    const cleaned = stripHtml(value).replace(/\s+/g, ' ').trim();
    if (!cleaned) return '';
    return cleaned.length > maxLength ? cleaned.slice(0, maxLength) : cleaned;
}

module.exports = { stripHtml, sanitizeText };
