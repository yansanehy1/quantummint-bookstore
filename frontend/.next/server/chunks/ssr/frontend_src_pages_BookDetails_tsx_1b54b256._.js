module.exports = [
"[project]/frontend/src/pages/BookDetails.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/wouter [external] (wouter, esm_import)");
// Icons used directly from lucide-react
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/book-open.js [ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/headphones.js [ssr] (ecmascript) <export default as Headphones>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/bookmark.js [ssr] (ecmascript) <export default as Bookmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/share-2.js [ssr] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [ssr] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/play.js [ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/pause.js [ssr] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/volume-2.js [ssr] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/download.js [ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/eye.js [ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/thumbs-up.js [ssr] (ecmascript) <export default as ThumbsUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$down$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsDown$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/thumbs-down.js [ssr] (ecmascript) <export default as ThumbsDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/trash-2.js [ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/square-pen.js [ssr] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/send.js [ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/message-square.js [ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$check$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Verified$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/badge-check.js [ssr] (ecmascript) <export default as Verified>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/star.js [ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/x.js [ssr] (ecmascript) <export default as X>");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
// --- START: MOCK UI COMPONENTS (to satisfy single-file mandate) ---
const NotificationBar = ({ message, type, onClose })=>{
    if (!message) return null;
    const baseClasses = "fixed bottom-4 right-4 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 transition-all duration-300 transform";
    let colorClasses = "bg-green-500 text-white";
    if (type === 'error') colorClasses = "bg-red-500 text-white";
    if (type === 'info') colorClasses = "bg-blue-500 text-white";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: `${baseClasses} ${colorClasses}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                children: message
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: onClose,
                className: "text-white hover:opacity-80",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    className: "w-5 h-5"
                }, void 0, false, {
                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
// Mock 'toast' function using the internal NotificationBar state
const useToastMock = ()=>{
    const [toastState, setToastState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        message: '',
        type: '',
        id: 0
    });
    const showToast = (message, type = 'info')=>{
        const id = Date.now();
        setToastState({
            message,
            type,
            id
        });
        setTimeout(()=>{
            setToastState((current)=>current.id === id ? {
                    message: '',
                    type: '',
                    id: 0
                } : current);
        }, 3000); // Auto-dismiss after 3s
    };
    return {
        toastState,
        success: (message)=>showToast(message, 'success'),
        error: (message)=>showToast(message, 'error'),
        info: (message)=>showToast(message, 'info'),
        onClose: ()=>setToastState({
                message: '',
                type: '',
                id: 0
            })
    };
};
const Button = ({ children, className = "", variant = "default", onClick, disabled, 'aria-label': ariaLabel, 'aria-pressed': ariaPressed })=>{
    let baseClasses = "font-semibold transition duration-200 ease-in-out py-2 px-4 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center";
    if (variant === "default") {
        baseClasses += " bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 focus:ring-amber-500/50";
    } else if (variant === "outline") {
        baseClasses += " bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-300/50";
    } else if (variant === "ghost") {
        baseClasses += " bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300/50 shadow-none";
    }
    if (disabled) {
        baseClasses = baseClasses.replace("hover:bg-amber-700 active:bg-amber-800", "").replace("hover:bg-gray-50 active:bg-gray-100", "") + " opacity-50 cursor-not-allowed";
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
        className: `${baseClasses} ${className}`,
        onClick: onClick,
        disabled: disabled,
        "aria-label": ariaLabel,
        "aria-pressed": ariaPressed,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const Card = ({ children, className = "" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: `bg-white rounded-2xl shadow-lg transition duration-300 hover:shadow-xl ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 69,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const Header = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-md",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-black text-amber-700",
                    children: [
                        "Book",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "text-gray-900",
                            children: "Verse"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                            lineNumber: 77,
                            columnNumber: 62
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                    lineNumber: 77,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                    className: "hidden sm:flex space-x-6 text-gray-600 font-medium",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "#",
                            className: "hover:text-amber-600 transition",
                            children: "Library"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                            lineNumber: 79,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "#",
                            className: "hover:text-amber-600 transition",
                            children: "Explore"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                            lineNumber: 80,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "#",
                            className: "hover:text-amber-600 transition",
                            children: "Wallet (500)"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                            lineNumber: 81,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                    lineNumber: 78,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                    variant: "outline",
                    className: "text-amber-600 border-amber-600 hover:bg-amber-50",
                    children: "Sign Out"
                }, void 0, false, {
                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                    lineNumber: 83,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
            lineNumber: 76,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 75,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const Footer = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
        className: "bg-gray-900 text-white py-10 mt-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container max-w-6xl mx-auto px-4 text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                children: [
                    "© ",
                    new Date().getFullYear(),
                    " BookVerse. All rights reserved."
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
            lineNumber: 90,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 89,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const StarRating = ({ rating, readOnly = true, size = "md", showLabel = true })=>{
    const numStars = Math.round(rating * 2) / 2; // Round to nearest half
    const maxStars = 5;
    const starSize = size === 'lg' ? 6 : size === 'md' ? 5 : 4;
    const starClasses = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1",
        children: [
            Array.from({
                length: maxStars
            }).map((_, index)=>{
                const full = index < Math.floor(numStars);
                const half = !full && index < numStars;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                    className: `${starClasses} ${full || half ? 'text-amber-500 fill-amber-500' : 'text-gray-300 fill-gray-100'}`
                }, index, false, {
                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                    lineNumber: 109,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            }),
            showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: "ml-2 font-semibold text-gray-900",
                children: rating.toFixed(1)
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 112,
                columnNumber: 21
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const ReviewForm = ({ onSubmit })=>{
    const [rating, setRating] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const { success } = useToastMock();
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (rating === 0 || !title || !content) return;
        onSubmit({
            rating,
            title,
            content
        });
        setRating(0);
        setTitle('');
        setContent('');
        success("Review submitted successfully!");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
        className: "p-6 border border-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                className: "text-xl font-bold mb-4",
                children: "Write a Review"
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Rating"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5
                                ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                        className: `w-6 h-6 cursor-pointer transition ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 fill-gray-100'}`,
                                        onClick: ()=>setRating(star)
                                    }, star, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                htmlFor: "review-title",
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Review Title"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                id: "review-title",
                                type: "text",
                                value: title,
                                onChange: (e)=>setTitle(e.target.value),
                                className: "w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                htmlFor: "review-content",
                                className: "block text-sm font-medium text-gray-700 mb-2",
                                children: "Your Review"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                id: "review-content",
                                rows: 4,
                                value: content,
                                onChange: (e)=>setContent(e.target.value),
                                className: "w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                        type: "submit",
                        className: "w-full",
                        children: "Submit Review"
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const ReviewWithReplies = ({ review, replies, onDelete, onEdit, onHelpful, onUnhelpful, onReplySubmit, onReplyDelete })=>{
    const [showReplyForm, setShowReplyForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [replyContent, setReplyContent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const isUserReview = review.userName === "You"; // Simple mock for user identity
    const isAuthor = review.userName === "Dr. Ahmed Hassan"; // Simple mock for author identity
    const handleReplySubmit = (e)=>{
        e.preventDefault();
        if (replyContent.trim()) {
            onReplySubmit(review.id, {
                content: replyContent
            });
            setReplyContent('');
            setShowReplyForm(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
        className: "p-6 space-y-4 border border-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700 text-lg",
                                children: review.userName[0]
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-gray-900",
                                        children: review.userName
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(StarRating, {
                                        rating: review.rating,
                                        size: "sm",
                                        showLabel: false
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 199,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-right",
                        children: [
                            review.isVerifiedPurchase && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center text-xs text-green-600 mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$check$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Verified$3e$__["Verified"], {
                                        className: "w-4 h-4 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Verified Purchase"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500",
                                children: new Date(review.date).toLocaleDateString()
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h5", {
                className: "text-xl font-bold text-gray-900",
                children: review.title
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-gray-700 whitespace-pre-wrap",
                children: review.content
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 text-sm text-gray-600",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                variant: "ghost",
                                className: "h-auto p-1 text-gray-600 hover:text-green-600",
                                onClick: ()=>onHelpful(review.id),
                                "aria-label": "Mark review as helpful",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__["ThumbsUp"], {
                                        className: "w-4 h-4 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 218,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " (",
                                    review.helpfulCount,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 217,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                variant: "ghost",
                                className: "h-auto p-1 text-gray-600 hover:text-red-600",
                                onClick: ()=>onUnhelpful(review.id),
                                "aria-label": "Mark review as unhelpful",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$down$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsDown$3e$__["ThumbsDown"], {
                                        className: "w-4 h-4 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " (",
                                    review.unhelpfulCount,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 220,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 216,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    isUserReview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                variant: "ghost",
                                className: "h-auto p-1 text-red-600",
                                onClick: ()=>onDelete(review.id),
                                "aria-label": "Delete review",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 227,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                variant: "ghost",
                                className: "h-auto p-1 text-blue-600",
                                onClick: ()=>onEdit(review.id),
                                "aria-label": "Edit review",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                    lineNumber: 231,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                        variant: "ghost",
                        className: "h-auto p-1 text-amber-600",
                        onClick: ()=>setShowReplyForm(!showReplyForm),
                        "aria-label": "Toggle reply form",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                className: "w-4 h-4 mr-1"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Reply"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showReplyForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleReplySubmit,
                className: "mt-4 flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: replyContent,
                        onChange: (e)=>setReplyContent(e.target.value),
                        placeholder: "Write a reply...",
                        className: "flex-1 p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 242,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                        type: "submit",
                        className: "px-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                            lineNumber: 251,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 241,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            replies.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "pl-8 pt-2 border-l-2 border-gray-100 space-y-3",
                children: replies.map((reply)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-sm p-3 bg-gray-50 rounded-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-gray-900",
                                        children: [
                                            reply.authorName,
                                            " ",
                                            reply.isAuthor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-amber-600 text-xs font-semibold",
                                                children: "(Author)"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 261,
                                                columnNumber: 94
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 261,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    reply.authorName === "You" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                        variant: "ghost",
                                        className: "h-auto p-0.5 text-red-600",
                                        onClick: ()=>onReplyDelete(reply.id),
                                        "aria-label": "Delete reply",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "w-3 h-3"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                            lineNumber: 264,
                                            columnNumber: 25
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 263,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 260,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-gray-700",
                                children: reply.content
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 268,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 mt-1",
                                children: new Date(reply.date).toLocaleDateString()
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 269,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, reply.id, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 259,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 257,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const BookAccessGate = ({ bookPrice, userBalance, isPurchased, onPurchase, onStartPayPerUse })=>{
    const { success, info } = useToastMock();
    const handlePurchase = ()=>{
        if (userBalance >= bookPrice) {
            onPurchase();
            success(`Purchased for $${bookPrice.toFixed(2)}!`);
        } else {
            info("Insufficient balance. Please top up your wallet.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
        className: "p-8 border-4 border-amber-200 bg-amber-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold mb-4 text-amber-800",
                children: "Unlock Full Access"
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 291,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-gray-700 mb-6",
                children: "This book is not yet in your library. Choose an access option below."
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 292,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                        onClick: handlePurchase,
                        className: "flex-col h-auto py-5 bg-amber-600 hover:bg-amber-700 text-white shadow-xl hover:shadow-2xl transition",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                className: "w-6 h-6 mb-1"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 299,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-lg",
                                children: "Buy Permanently"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 300,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-sm font-light",
                                children: [
                                    "for $",
                                    bookPrice.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 301,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 295,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                        onClick: ()=>onStartPayPerUse("reading"),
                        variant: "outline",
                        className: "flex-col h-auto py-5 border-amber-600 text-amber-800 hover:bg-amber-100 shadow-xl hover:shadow-2xl transition",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                className: "w-6 h-6 mb-1"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 309,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-lg",
                                children: "Pay Per Use"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 310,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-sm font-light",
                                children: "Start Reading Session"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 311,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 304,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 294,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 290,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const RealTimeSessionTracker = ({ sessionType, onSessionEnd })=>{
    const [seconds, setSeconds] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const { info } = useToastMock();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const interval = setInterval(()=>{
            setSeconds((s)=>s + 1);
        }, 1000);
        return ()=>clearInterval(interval);
    }, []);
    const endSession = ()=>{
        const minutes = Math.floor(seconds / 60);
        const cost = (minutes * 0.1).toFixed(2); // Mock cost calculation
        info(`Session ended. Duration: ${minutes} min. Mock cost: $${cost}.`);
        onSessionEnd({
            minutes,
            cost
        });
    };
    const formatTime = (totalSeconds)=>{
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor(totalSeconds % 3600 / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
        className: "p-6 bg-blue-50 border-4 border-blue-200",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex justify-between items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__["Headphones"], {
                            className: `w-6 h-6 ${sessionType === 'listening' ? 'text-blue-600' : 'hidden'}`
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                            lineNumber: 347,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                            className: `w-6 h-6 ${sessionType === 'reading' ? 'text-blue-600' : 'hidden'}`
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                            lineNumber: 348,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "font-bold text-lg text-blue-800",
                                    children: [
                                        "Active ",
                                        sessionType === 'reading' ? 'Reading' : 'Listening',
                                        " Session"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                    lineNumber: 350,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600",
                                    children: "Cost: $0.10/min (Mock Rate)"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                    lineNumber: 351,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                            lineNumber: 349,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                    lineNumber: 346,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "text-right",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-3xl font-mono font-extrabold text-blue-900",
                            children: formatTime(seconds)
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                            lineNumber: 355,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                            onClick: endSession,
                            className: "mt-2 bg-red-500 hover:bg-red-600 text-white py-1 text-sm px-3",
                            children: "End Session"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                            lineNumber: 356,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                    lineNumber: 354,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
            lineNumber: 345,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 344,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
// --- END: MOCK UI COMPONENTS ---
const App = ()=>{
    const [, setLocation] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["useLocation"])();
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1);
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [isBookmarked, setIsBookmarked] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showBookmarks, setShowBookmarks] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("reader");
    const [activeSession, setActiveSession] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isPurchased, setIsPurchased] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [userBalance] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(500);
    const readerPanelRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const reviewsPanelRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const { toastState, success, info, onClose } = useToastMock(); // Use mock toast
    const mockReviews = [
        {
            id: 1,
            userName: "Sarah Johnson",
            rating: 5,
            title: "Excellent and comprehensive!",
            content: "This book is incredibly well-written and covers all the essential concepts. The audio narration is clear and helpful.",
            date: "2024-10-15",
            helpfulCount: 24,
            unhelpfulCount: 2,
            isVerifiedPurchase: true
        },
        {
            id: 2,
            userName: "Michael Chen",
            rating: 4,
            title: "Great content, could use more examples",
            content: "The explanations are solid, but I wish there were more worked examples throughout each chapter.",
            date: "2024-10-10",
            helpfulCount: 15,
            unhelpfulCount: 1,
            isVerifiedPurchase: true
        }
    ];
    const mockReplies = {
        1: [
            {
                id: 1,
                authorName: "Dr. Ahmed Hassan",
                content: "Thank you so much for the detailed feedback! We're glad you found the audio narration helpful. We're constantly working to improve the content based on reader suggestions.",
                date: "2024-10-16",
                isAuthor: true
            }
        ],
        2: [
            {
                id: 2,
                authorName: "Dr. Ahmed Hassan",
                content: "Great point about the examples! We've actually included additional worked examples in the appendix. You can find them on pages 240-250. We'll consider adding more examples to the main text in the next edition.",
                date: "2024-10-12",
                isAuthor: true
            }
        ]
    };
    const handleStartPayPerUse = (sessionType)=>{
        setActiveSession({
            type: sessionType
        });
        info(`Starting new pay-per-use ${sessionType} session.`);
    };
    const handleSessionEnd = (_state)=>{
        setActiveSession(null);
    };
    const mockBook = {
        id: 1,
        title: "Introduction to Physics",
        author: "Dr. Ahmed Hassan",
        category: "Science",
        price: 4.99,
        rating: 4.5,
        reviews: 128,
        description: "A comprehensive introduction to physics covering mechanics, thermodynamics, and waves. Perfect for high school and early university students. This book aims to simplify complex concepts and provide a solid foundation for further study in the physical sciences.",
        pages: 256,
        language: "English",
        publishedDate: "2023-06-15",
        cover: "⚛️",
        hasAudio: true
    };
    const mockPages = [
        {
            number: 1,
            content: "Chapter 1: Fundamentals of Motion\n\nMotion is the change in position of an object over time. The study of motion without considering the forces that cause it is called kinematics.",
            audioUrl: "https://mock-audio/page1.mp3",
            audioTimestamp: 0
        },
        {
            number: 2,
            content: "Velocity and Speed\n\nVelocity is a vector quantity that describes the rate of change of position. Speed is the magnitude of velocity.",
            audioUrl: "https://mock-audio/page2.mp3",
            audioTimestamp: 0
        },
        {
            number: 3,
            content: "Acceleration\n\nAcceleration is the rate of change of velocity. It can be positive (speeding up) or negative (slowing down).",
            audioUrl: "https://mock-audio/page3.mp3",
            audioTimestamp: 0
        }
    ];
    const mockBookmarks = [
        {
            id: 1,
            page: 1,
            note: "Important definition",
            timestamp: "2024-01-15 10:30"
        },
        {
            id: 2,
            page: 2,
            note: "Need to review this",
            timestamp: "2024-01-15 11:45"
        }
    ];
    const currentPageData = mockPages.find((p)=>p.number === currentPage);
    // Reviews state and handlers
    const [reviews, setReviews] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(mockReviews);
    const [replies, setReplies] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(mockReplies);
    const handleHelpful = (id)=>{
        setReviews((rs)=>rs.map((r)=>r.id === id ? {
                    ...r,
                    helpfulCount: r.helpfulCount + 1
                } : r));
        success("Marked as helpful!");
    };
    const handleUnhelpful = (id)=>{
        setReviews((rs)=>rs.map((r)=>r.id === id ? {
                    ...r,
                    unhelpfulCount: r.unhelpfulCount + 1
                } : r));
        info("Feedback registered.");
    };
    const handleDeleteReview = (id)=>{
        setReviews((rs)=>rs.filter((r)=>r.id !== id));
        success("Review deleted.");
    };
    const handleEditReview = (id)=>{
        info("Edit dialog opened (Not implemented).");
    };
    const handleReplySubmit = (reviewId, reply)=>{
        const newReply = {
            id: Date.now(),
            authorName: "You",
            content: reply.content,
            date: new Date().toISOString(),
            isAuthor: false
        };
        setReplies((map)=>({
                ...map,
                [reviewId]: [
                    ...map[reviewId] || [],
                    newReply
                ]
            }));
        success("Reply posted!");
    };
    const handleReplyDelete = (replyId)=>{
        setReplies((map)=>{
            const entries = Object.entries(map).map(([rid, arr])=>[
                    rid,
                    arr.filter((r)=>r.id !== replyId)
                ]);
            return Object.fromEntries(entries);
        });
        success("Reply deleted.");
    };
    const handlePlayPause = ()=>{
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                // Mocked play functionality (will fail without a real audio source)
                // audioRef.current.play().catch(e => console.log("Audio play failed:", e));
                info(isPlaying ? "Audio paused." : "Audio playing (Mocked).");
            }
            setIsPlaying(!isPlaying);
        }
    };
    const handleAddBookmark = ()=>{
        setIsBookmarked(!isBookmarked);
        if (!isBookmarked) {
            success(`Bookmark added to Page ${currentPage}.`);
            mockBookmarks.push({
                id: Date.now(),
                page: currentPage,
                note: `Quick mark on Page ${currentPage}`,
                timestamp: new Date().toLocaleTimeString()
            });
        } else {
            info(`Bookmark removed from Page ${currentPage}.`);
        }
    };
    const handleNextPage = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        if (currentPage < mockPages.length) {
            setCurrentPage(currentPage + 1);
            setCurrentTime(0);
            setIsPlaying(false);
            info(`Mapsd to Page ${currentPage + 1}`);
        }
    }, [
        currentPage,
        mockPages.length,
        info
    ]);
    const handlePreviousPage = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setCurrentTime(0);
            setIsPlaying(false);
            info(`Mapsd to Page ${currentPage - 1}`);
        }
    }, [
        currentPage,
        info
    ]);
    const formatTime = (seconds)=>{
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    // Keyboard navigation: Space toggles play, arrows navigate pages
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const onKey = (e)=>{
            // Check if focus is not on an input/textarea
            if ([
                "INPUT",
                "TEXTAREA"
            ].includes(e.target.tagName)) return;
            if (e.key === " ") {
                e.preventDefault();
                handlePlayPause();
            } else if (e.key === "ArrowRight") {
                handleNextPage();
            } else if (e.key === "ArrowLeft") {
                handlePreviousPage();
            }
        };
        window.addEventListener("keydown", onKey);
        return ()=>window.removeEventListener("keydown", onKey);
    }, [
        handleNextPage,
        handlePlayPause,
        handlePreviousPage
    ]);
    // Lazy-load audio src per page (mocked)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (audioRef.current && currentPageData?.audioUrl) {
            // In a real app, you'd load the audio here. For mock, we skip actual loading.
            // audioRef.current.src = currentPageData.audioUrl;
            // audioRef.current.load(); 
            setDuration(180); // Mock duration
            setCurrentTime(0); // Reset time on page change
        }
    }, [
        currentPageData
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 font-sans",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Header, {}, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 592,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: "container max-w-6xl mx-auto px-4 py-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: "grid md:grid-cols-3 gap-10 mb-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "md:col-span-1 flex flex-col items-center md:items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-3xl p-6 shadow-2xl transition duration-300 hover:shadow-amber-400/50 w-full max-w-sm aspect-h-1 aspect-w-1 mb-8",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "bg-gradient-to-br from-amber-200 to-orange-300 rounded-2xl h-full flex items-center justify-center text-[10rem] shadow-inner",
                                            children: mockBook.cover
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                            lineNumber: 601,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 600,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-full max-w-sm space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                                onClick: ()=>{
                                                    success(`Added "${mockBook.title}" to cart.`);
                                                    setLocation("/checkout");
                                                },
                                                className: "w-full py-4 text-xl bg-amber-600 hover:bg-amber-700 shadow-amber-500/50 shadow-lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                                        className: "w-6 h-6 mr-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 609,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "Buy Now - $",
                                                    mockBook.price.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 605,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                                variant: "outline",
                                                className: "w-full py-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                        className: "w-5 h-5 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 612,
                                                        columnNumber: 67
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "Download Sample"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 612,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                                variant: "outline",
                                                className: "w-full py-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                                        className: "w-5 h-5 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 613,
                                                        columnNumber: 67
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "Share Book"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 613,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 604,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 599,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                        className: "text-5xl font-extrabold text-gray-900 mb-2 leading-tight",
                                        children: mockBook.title
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 619,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-2xl text-amber-600 font-medium mb-6",
                                        children: [
                                            "by ",
                                            mockBook.author
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 620,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center gap-6 mb-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center text-xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(StarRating, {
                                                        rating: mockBook.rating,
                                                        readOnly: true,
                                                        size: "md",
                                                        showLabel: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 624,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-600 ml-3",
                                                        children: [
                                                            "(",
                                                            mockBook.reviews,
                                                            " reviews)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 625,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 623,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            mockBook.hasAudio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold shadow-inner",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__["Headphones"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 629,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-sm",
                                                        children: "Audio Available"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 630,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 628,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 622,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-gray-700 mb-8 text-xl leading-relaxed border-l-4 border-amber-400 pl-4",
                                        children: mockBook.description
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 635,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                                                className: "p-4 bg-white/70 backdrop-blur-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-600 text-sm mb-1",
                                                        children: "Pages"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 638,
                                                        columnNumber: 66
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-2xl font-extrabold text-amber-700",
                                                        children: mockBook.pages
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 638,
                                                        columnNumber: 117
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 638,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                                                className: "p-4 bg-white/70 backdrop-blur-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-600 text-sm mb-1",
                                                        children: "Category"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 639,
                                                        columnNumber: 66
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-2xl font-extrabold text-gray-900",
                                                        children: mockBook.category
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 639,
                                                        columnNumber: 120
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 639,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                                                className: "p-4 bg-white/70 backdrop-blur-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-600 text-sm mb-1",
                                                        children: "Language"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 640,
                                                        columnNumber: 66
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-2xl font-extrabold text-gray-900",
                                                        children: mockBook.language
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 640,
                                                        columnNumber: 120
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 640,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                                                className: "p-4 bg-white/70 backdrop-blur-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-600 text-sm mb-1",
                                                        children: "Published"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 641,
                                                        columnNumber: 66
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-2xl font-extrabold text-gray-900",
                                                        children: mockBook.publishedDate
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 641,
                                                        columnNumber: 121
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 641,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 637,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 618,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 596,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 border-b-2 border-gray-200 mb-8",
                                role: "tablist",
                                "aria-label": "Reading page tabs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        id: "tab-reader",
                                        role: "tab",
                                        "aria-selected": activeTab === "reader",
                                        "aria-controls": "tab-content-reader",
                                        onClick: ()=>{
                                            setActiveTab("reader");
                                            setTimeout(()=>readerPanelRef.current?.focus(), 0);
                                        },
                                        className: `px-4 py-3 text-lg font-bold transition ${activeTab === "reader" ? "border-b-4 border-amber-600 text-amber-600" : "border-transparent text-gray-600 hover:text-gray-900"}`,
                                        children: "Reader Access"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 649,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        id: "tab-reviews",
                                        role: "tab",
                                        "aria-selected": activeTab === "reviews",
                                        "aria-controls": "tab-content-reviews",
                                        onClick: ()=>{
                                            setActiveTab("reviews");
                                            setTimeout(()=>reviewsPanelRef.current?.focus(), 0);
                                        },
                                        className: `px-4 py-3 text-lg font-bold transition ${activeTab === "reviews" ? "border-b-4 border-amber-600 text-amber-600" : "border-transparent text-gray-600 hover:text-gray-900"}`,
                                        children: "Reviews & Ratings"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 650,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 648,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            activeTab === "reader" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                id: "tab-content-reader",
                                role: "tabpanel",
                                "aria-labelledby": "tab-reader",
                                ref: readerPanelRef,
                                tabIndex: -1,
                                className: "space-y-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: [
                                            activeSession && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(RealTimeSessionTracker, {
                                                bookId: mockBook.id,
                                                bookTitle: mockBook.title,
                                                bookLevel: "SSS",
                                                userBalance: userBalance,
                                                sessionType: activeSession.type,
                                                onSessionEnd: handleSessionEnd
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 659,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            !isPurchased && !activeSession && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(BookAccessGate, {
                                                bookId: mockBook.id,
                                                bookTitle: mockBook.title,
                                                bookLevel: "SSS",
                                                bookPrice: mockBook.price,
                                                userBalance: userBalance,
                                                isPurchased: isPurchased,
                                                onPurchase: ()=>{
                                                    setIsPurchased(true);
                                                    success("Book purchased successfully!");
                                                },
                                                onStartPayPerUse: handleStartPayPerUse
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 663,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            (isPurchased || activeSession) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                                                className: "p-8 bg-green-50 border-4 border-green-200",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                        className: "text-2xl font-bold mb-4 text-green-800",
                                                        children: "Your Library Access"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 668,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-700 mb-4",
                                                        children: "This book is ready to read. Continue where you left off!"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 669,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                                        className: "bg-green-600 hover:bg-green-700 text-white",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                                className: "w-5 h-5 mr-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                lineNumber: 670,
                                                                columnNumber: 92
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            "Continue Reading"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 670,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 667,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 657,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                                        className: "p-8 border-2 border-gray-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center mb-6 border-b pb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                        className: "text-2xl font-bold text-gray-800",
                                                        children: "Current Chapter Preview"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 678,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                                        onClick: ()=>setShowBookmarks(!showBookmarks),
                                                        variant: showBookmarks ? "default" : "outline",
                                                        className: showBookmarks ? "bg-blue-600 hover:bg-blue-700" : "border-blue-500 text-blue-600 hover:bg-blue-50",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"], {
                                                                className: "w-4 h-4 mr-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                lineNumber: 680,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            "Bookmarks (",
                                                            mockBookmarks.length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 679,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 677,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "grid lg:grid-cols-3 gap-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "lg:col-span-2 space-y-8",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "bg-white border-4 border-gray-100 rounded-xl p-8 shadow-xl min-h-[500px] flex flex-col justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm font-semibold text-gray-500 mb-6 border-b pb-2",
                                                                                children: [
                                                                                    "Page ",
                                                                                    currentPage,
                                                                                    " of ",
                                                                                    mockPages.length
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                lineNumber: 690,
                                                                                columnNumber: 37
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "text-gray-900 text-xl leading-loose whitespace-pre-wrap font-serif",
                                                                                children: currentPageData?.content
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                lineNumber: 691,
                                                                                columnNumber: 37
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 689,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "text-center mt-6",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                                                            onClick: handleAddBookmark,
                                                                            "aria-pressed": isBookmarked,
                                                                            "aria-label": "Toggle bookmark",
                                                                            className: `py-2 px-6 ${isBookmarked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-400 text-gray-700"}`,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"], {
                                                                                    className: "w-4 h-4 mr-2"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                    lineNumber: 695,
                                                                                    columnNumber: 41
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                isBookmarked ? "Bookmarked" : "Add Bookmark"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                            lineNumber: 694,
                                                                            columnNumber: 37
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 693,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                lineNumber: 688,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            mockBook.hasAudio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                                                                className: "p-6 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg border-2 border-blue-200",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "text-lg font-bold text-blue-800 mb-4 flex items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__["Headphones"], {
                                                                                className: "w-5 h-5 mr-2"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                lineNumber: 704,
                                                                                columnNumber: 108
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Audio Narration"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 704,
                                                                        columnNumber: 37
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                "aria-label": isPlaying ? "Pause audio" : "Play audio",
                                                                                onClick: handlePlayPause,
                                                                                className: "w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl hover:bg-blue-700 transition transform hover:scale-105",
                                                                                children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                                                                    className: "w-7 h-7"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                    lineNumber: 707,
                                                                                    columnNumber: 58
                                                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                                                    className: "w-7 h-7 ml-1"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                    lineNumber: 707,
                                                                                    columnNumber: 90
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                lineNumber: 706,
                                                                                columnNumber: 41
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "flex-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        role: "progressbar",
                                                                                        "aria-valuenow": Math.round(currentTime / (duration || 1) * 100),
                                                                                        "aria-valuemin": 0,
                                                                                        "aria-valuemax": 100,
                                                                                        className: "bg-blue-200 h-2 rounded-full mb-2 cursor-pointer",
                                                                                        onClick: (e)=>{},
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "bg-blue-600 h-2 rounded-full transition-all duration-100",
                                                                                            style: {
                                                                                                width: `${currentTime / (duration || 1) * 100 || 0}%`
                                                                                            }
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                            lineNumber: 711,
                                                                                            columnNumber: 49
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                        lineNumber: 710,
                                                                                        columnNumber: 45
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "flex justify-between text-sm text-gray-600 font-mono",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                children: formatTime(currentTime)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                                lineNumber: 714,
                                                                                                columnNumber: 49
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                children: formatTime(duration)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                                lineNumber: 715,
                                                                                                columnNumber: 49
                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                        lineNumber: 713,
                                                                                        columnNumber: 45
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                lineNumber: 709,
                                                                                columnNumber: 41
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                                                                className: "w-6 h-6 text-blue-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                lineNumber: 718,
                                                                                columnNumber: 41
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 705,
                                                                        columnNumber: 37
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("audio", {
                                                                        ref: audioRef,
                                                                        onTimeUpdate: (e)=>setCurrentTime(e.currentTarget.currentTime),
                                                                        onLoadedMetadata: (e)=>setDuration(e.currentTarget.duration)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 720,
                                                                        columnNumber: 37
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                lineNumber: 703,
                                                                columnNumber: 33
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center mt-8",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                                                        onClick: handlePreviousPage,
                                                                        disabled: currentPage === 1,
                                                                        variant: "outline",
                                                                        className: "py-3 px-6 text-lg hover:bg-gray-100",
                                                                        "aria-label": "Go to previous page",
                                                                        children: "← Previous"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 726,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-xl font-bold text-gray-800",
                                                                        children: [
                                                                            currentPage,
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "text-gray-500 font-normal",
                                                                                children: [
                                                                                    "/ ",
                                                                                    mockPages.length
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                lineNumber: 730,
                                                                                columnNumber: 51
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 729,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Button, {
                                                                        onClick: handleNextPage,
                                                                        disabled: currentPage === mockPages.length,
                                                                        className: "py-3 px-6 text-lg bg-amber-600 hover:bg-amber-700",
                                                                        "aria-label": "Go to next page",
                                                                        children: "Next →"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 732,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                lineNumber: 725,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 687,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    showBookmarks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "lg:col-span-1",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                                                            className: "p-5 h-full bg-amber-50 shadow-inner border border-amber-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                    className: "font-bold text-xl mb-4 text-amber-800 flex items-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"], {
                                                                            className: "w-5 h-5 mr-2"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                            lineNumber: 742,
                                                                            columnNumber: 109
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        " Your Bookmarks"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                    lineNumber: 742,
                                                                    columnNumber: 37
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-4",
                                                                    children: mockBookmarks.length > 0 ? mockBookmarks.map((bm)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "border-l-4 border-amber-600 pl-3 py-2 bg-white rounded-md shadow-sm",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-bold text-gray-900",
                                                                                    children: [
                                                                                        "Page ",
                                                                                        bm.page
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                    lineNumber: 747,
                                                                                    columnNumber: 53
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-gray-700 italic",
                                                                                    children: [
                                                                                        '"',
                                                                                        bm.note,
                                                                                        '"'
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                    lineNumber: 748,
                                                                                    columnNumber: 53
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-gray-500 mt-1",
                                                                                    children: bm.timestamp
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                                    lineNumber: 749,
                                                                                    columnNumber: 53
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, bm.id, true, {
                                                                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                            lineNumber: 746,
                                                                            columnNumber: 49
                                                                        }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-600 text-sm",
                                                                        children: "No bookmarks yet. Click 'Add Bookmark' above!"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 753,
                                                                        columnNumber: 45
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                    lineNumber: 743,
                                                                    columnNumber: 37
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                            lineNumber: 741,
                                                            columnNumber: 33
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 740,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 685,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 676,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 655,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            activeTab === "reviews" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                id: "tab-content-reviews",
                                role: "tabpanel",
                                "aria-labelledby": "tab-reviews",
                                ref: reviewsPanelRef,
                                tabIndex: -1,
                                className: "space-y-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                                        className: "p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "text-3xl font-bold mb-8 text-amber-800",
                                                children: "Overall Ratings & Breakdown"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 770,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "grid md:grid-cols-3 gap-12 items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "text-center border-r md:border-r-2 border-amber-200 pr-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-7xl font-extrabold text-amber-600 mb-2",
                                                                children: mockBook.rating.toFixed(1)
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                lineNumber: 773,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(StarRating, {
                                                                rating: mockBook.rating,
                                                                readOnly: true,
                                                                size: "lg",
                                                                showLabel: false
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                lineNumber: 774,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-lg text-gray-600 mt-4",
                                                                children: [
                                                                    "Based on ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "font-bold",
                                                                        children: mockBook.reviews
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 775,
                                                                        columnNumber: 72
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " reviews"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                lineNumber: 775,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 772,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "md:col-span-2 space-y-2",
                                                        children: [
                                                            5,
                                                            4,
                                                            3,
                                                            2,
                                                            1
                                                        ].map((stars)=>{
                                                            const count = stars === 5 ? 83 : stars === 4 ? 32 : stars === 3 ? 9 : stars === 2 ? 3 : 1;
                                                            const percentage = count / mockBook.reviews * 100;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-lg font-medium text-gray-700 w-8",
                                                                        children: [
                                                                            stars,
                                                                            "★"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 784,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1 bg-gray-200 rounded-full h-3.5",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "bg-amber-500 h-3.5 rounded-full transition-all duration-500",
                                                                            style: {
                                                                                width: `${percentage}%`
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                            lineNumber: 786,
                                                                            columnNumber: 37
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 785,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-base text-gray-600 w-12 text-right",
                                                                        children: count
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                        lineNumber: 788,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, stars, true, {
                                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                                lineNumber: 783,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0));
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                        lineNumber: 778,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 771,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 769,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ReviewForm, {
                                        onSubmit: ({ rating, title, content })=>{
                                            const newReview = {
                                                id: Date.now(),
                                                userName: "You",
                                                rating,
                                                title,
                                                content,
                                                date: new Date().toISOString(),
                                                helpfulCount: 0,
                                                unhelpfulCount: 0,
                                                isVerifiedPurchase: true,
                                                isUserReview: true
                                            };
                                            setReviews((rs)=>[
                                                    newReview,
                                                    ...rs
                                                ]);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 797,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "text-2xl font-bold text-gray-800 border-b pb-2",
                                                children: [
                                                    "All Customer Reviews (",
                                                    reviews.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                lineNumber: 817,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            reviews.map((review)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ReviewWithReplies, {
                                                    review: review,
                                                    replies: replies[review.id] || [],
                                                    bookAuthorId: 1,
                                                    currentUserId: 1,
                                                    onDelete: handleDeleteReview,
                                                    onEdit: handleEditReview,
                                                    onHelpful: handleHelpful,
                                                    onUnhelpful: handleUnhelpful,
                                                    onReplySubmit: handleReplySubmit,
                                                    onReplyDelete: handleReplyDelete
                                                }, review.id, false, {
                                                    fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                                    lineNumber: 819,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                        lineNumber: 816,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                                lineNumber: 766,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                        lineNumber: 647,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 594,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Footer, {}, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 839,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(NotificationBar, {
                ...toastState,
                onClose: onClose
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/BookDetails.tsx",
                lineNumber: 841,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/pages/BookDetails.tsx",
        lineNumber: 591,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = App;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=frontend_src_pages_BookDetails_tsx_1b54b256._.js.map