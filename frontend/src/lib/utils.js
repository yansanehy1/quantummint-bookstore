"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.formatPrice = formatPrice;
exports.formatDate = formatDate;
exports.truncate = truncate;
exports.generateSlug = generateSlug;
exports.isBrowser = isBrowser;
exports.getBaseUrl = getBaseUrl;
exports.debounce = debounce;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
function formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(price);
}
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
function truncate(str, length) {
    if (str.length <= length)
        return str;
    return `${str.slice(0, length)}...`;
}
function generateSlug(str) {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
function isBrowser() {
    return typeof window !== 'undefined';
}
function getBaseUrl() {
    if (isBrowser())
        return '';
    // Reference for vercel.com
    if (process.env.VERCEL_URL)
        return `https://${process.env.VERCEL_URL}`;
    // Reference for render.com
    if (process.env.RENDER_INSTANCE_ID)
        return `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
    // Assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`;
}
function debounce(func, wait) {
    let timeout = null;
    return function (...args) {
        const context = this;
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
