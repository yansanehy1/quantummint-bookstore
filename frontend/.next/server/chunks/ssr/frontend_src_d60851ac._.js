module.exports = [
"[project]/frontend/src/components/ui/sonner.tsx [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/sonner [external] (sonner, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend/src/components/ui/tooltip.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TooltipProvider",
    ()=>TooltipProvider,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const TooltipProvider = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: children
    }, void 0, false);
const __TURBOPACK__default__export__ = TooltipProvider;
}),
"[project]/frontend/src/components/ErrorBoundary.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].Component {
    state = {
        hasError: false
    };
    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }
    componentDidCatch(error, info) {
        // eslint-disable-next-line no-console
        console.error("ErrorBoundary caught: ", error, info);
    }
    render() {
        if (this.state.hasError) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "min-h-screen flex items-center justify-center p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold mb-2",
                            children: "Something went wrong."
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                            lineNumber: 22,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-gray-600",
                            children: "Please reload the page."
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                            lineNumber: 23,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                    lineNumber: 21,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
}),
"[project]/frontend/src/components/layout/Header.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/book-open.js [ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/house.js [ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$library$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Library$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/library.js [ssr] (ecmascript) <export default as Library>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/wallet.js [ssr] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/chart-column.js [ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/wouter [external] (wouter, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function Header() {
    const [, setLocation] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["useLocation"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
        className: "bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg sticky top-0 z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container max-w-7xl mx-auto px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setLocation("/"),
                        className: "flex items-center gap-3 text-white hover:text-amber-100 transition-colors duration-200 group",
                        "aria-label": "Sierra Books Home",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-all duration-200 group-hover:scale-110",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                    className: "w-7 h-7"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                    lineNumber: 18,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                lineNumber: 17,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-2xl font-extrabold tracking-tight hidden sm:inline",
                                children: "Sierra Books"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                lineNumber: 20,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                        lineNumber: 12,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                        className: "flex items-center gap-2 md:gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium text-sm md:text-base",
                                onClick: ()=>setLocation("/"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                        lineNumber: 31,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Home"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                        lineNumber: 32,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                lineNumber: 27,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium text-sm md:text-base",
                                onClick: ()=>setLocation("/library"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$library$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Library$3e$__["Library"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                        lineNumber: 38,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Library"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                        lineNumber: 39,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium text-sm md:text-base",
                                onClick: ()=>setLocation("/dashboard"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                        lineNumber: 46,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                lineNumber: 41,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium text-sm md:text-base",
                                onClick: ()=>setLocation("/wallet"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                        lineNumber: 52,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Wallet"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                        lineNumber: 53,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-2 px-4 py-2 bg-white/30 text-white hover:bg-white/40 rounded-xl transition-all duration-200 font-semibold text-sm md:text-base shadow-md",
                                onClick: ()=>setLocation("/reading-analytics"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "hidden md:inline",
                                        children: "Analytics"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-2 px-4 py-2 bg-white text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200 font-bold text-sm md:text-base shadow-md",
                                onClick: ()=>setLocation("../../pages/login"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    children: "Sign In"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                    lineNumber: 66,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/layout/Header.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/components/layout/Header.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/components/layout/Header.tsx",
                lineNumber: 10,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/src/components/layout/Header.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/layout/Header.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend/src/components/ui/button.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["forwardRef"](({ className = "", variant = "default", size = "md", ...props }, ref)=>{
    const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        default: "bg-gray-900 text-white hover:bg-gray-800",
        outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
    };
    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
        ref: ref,
        className: [
            base,
            variants[variant],
            sizes[size],
            className
        ].join(" "),
        ...props
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/button.tsx",
        lineNumber: 21,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
const __TURBOPACK__default__export__ = Button;
}),
"[project]/frontend/src/components/ui/card.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["forwardRef"](({ className = "", ...props }, ref)=>{
    const base = "rounded-lg border border-gray-200 bg-white shadow-sm";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        ref: ref,
        className: [
            base,
            className
        ].join(" "),
        ...props
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
Card.displayName = "Card";
const __TURBOPACK__default__export__ = Card;
}),
"[project]/frontend/src/components/ui/input.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["forwardRef"](({ className = "", ...props }, ref)=>{
    const base = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
        ref: ref,
        className: [
            base,
            className
        ].join(" "),
        ...props
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
Input.displayName = "Input";
const __TURBOPACK__default__export__ = Input;
}),
"[project]/frontend/src/components/layout/Footer.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/book-open.js [ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/mail.js [ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/phone.js [ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/map-pin.js [ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/facebook.js [ssr] (ecmascript) <export default as Facebook>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/twitter.js [ssr] (ecmascript) <export default as Twitter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/instagram.js [ssr] (ecmascript) <export default as Instagram>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/heart.js [ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/wouter [external] (wouter, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function Footer() {
    const [, setLocation] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["useLocation"])();
    const currentYear = new Date().getFullYear();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
        className: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container max-w-7xl mx-auto px-4 py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-white",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "bg-amber-600 p-2 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                className: "w-6 h-6"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 16,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 15,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-bold",
                                            children: "Sierra Books"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 18,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                    lineNumber: 14,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm leading-relaxed",
                                    children: "Your trusted partner in educational publishing and audio learning experiences. Empowering learners across Sierra Leone and beyond."
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                    lineNumber: 20,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                            href: "#",
                                            className: "bg-gray-700 hover:bg-amber-600 p-2 rounded-lg transition-colors duration-200",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__["Facebook"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 26,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 25,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                            href: "#",
                                            className: "bg-gray-700 hover:bg-amber-600 p-2 rounded-lg transition-colors duration-200",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__["Twitter"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 29,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 28,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                            href: "#",
                                            className: "bg-gray-700 hover:bg-amber-600 p-2 rounded-lg transition-colors duration-200",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$instagram$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Instagram$3e$__["Instagram"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 32,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 31,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                    lineNumber: 24,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                            lineNumber: 13,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-white",
                                    children: "Quick Links"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setLocation("/about"),
                                                className: "hover:text-amber-400 transition-colors duration-200 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-amber-500",
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                        lineNumber: 43,
                                                        columnNumber: 19
                                                    }, this),
                                                    " About Us"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 42,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 41,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setLocation("/contact"),
                                                className: "hover:text-amber-400 transition-colors duration-200 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-amber-500",
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                        lineNumber: 48,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Contact"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 47,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 46,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setLocation("/faq"),
                                                className: "hover:text-amber-400 transition-colors duration-200 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-amber-500",
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                        lineNumber: 53,
                                                        columnNumber: 19
                                                    }, this),
                                                    " FAQ"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 52,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setLocation("/support"),
                                                className: "hover:text-amber-400 transition-colors duration-200 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-amber-500",
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                        lineNumber: 58,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Support"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 57,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-white",
                                    children: "Categories"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setLocation("/library?category=science"),
                                                className: "hover:text-amber-400 transition-colors duration-200 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-amber-500",
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                        lineNumber: 70,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Science"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 69,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setLocation("/library?category=mathematics"),
                                                className: "hover:text-amber-400 transition-colors duration-200 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-amber-500",
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                        lineNumber: 75,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Mathematics"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 74,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 73,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setLocation("/library?category=literature"),
                                                className: "hover:text-amber-400 transition-colors duration-200 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-amber-500",
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                        lineNumber: 80,
                                                        columnNumber: 19
                                                    }, this),
                                                    " Literature"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 79,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setLocation("/library?category=history"),
                                                className: "hover:text-amber-400 transition-colors duration-200 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-amber-500",
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                        lineNumber: 85,
                                                        columnNumber: 19
                                                    }, this),
                                                    " History"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                lineNumber: 84,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-white",
                                    children: "Contact Us"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            className: "flex items-start gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                    className: "w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-sm",
                                                    children: "Freetown, Sierra Leone"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 95,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            className: "flex items-start gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: "w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                    lineNumber: 100,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-sm",
                                                    children: "+232 XX XXX XXXX"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 99,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            className: "flex items-start gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: "w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                    lineNumber: 104,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-sm",
                                                    children: "info@sierrabooks.com"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "border-t border-gray-700 pt-8 mt-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row justify-between items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-center md:text-left",
                                children: [
                                    "© ",
                                    currentYear,
                                    " Sierra Books. All rights reserved."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: "Made with"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        className: "w-4 h-4 text-red-500 fill-red-500"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                        lineNumber: 119,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: "in Sierra Leone"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setLocation("/privacy"),
                                        className: "hover:text-amber-400 transition-colors duration-200",
                                        children: "Privacy Policy"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                        lineNumber: 123,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setLocation("/terms"),
                                        className: "hover:text-amber-400 transition-colors duration-200",
                                        children: "Terms of Service"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/frontend/src/components/layout/Footer.tsx",
                    lineNumber: 112,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/src/components/layout/Footer.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/layout/Footer.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend/src/components/ui/textarea.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const Textarea = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["forwardRef"](({ className = "", ...props }, ref)=>{
    const base = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
        ref: ref,
        className: [
            base,
            className
        ].join(" "),
        ...props
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
Textarea.displayName = "Textarea";
const __TURBOPACK__default__export__ = Textarea;
}),
"[project]/frontend/src/components/ui/tabs.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const Tabs = ({ children, className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/tabs.tsx",
        lineNumber: 4,
        columnNumber: 34
    }, ("TURBOPACK compile-time value", void 0));
const TabsList = ({ children, className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/tabs.tsx",
        lineNumber: 7,
        columnNumber: 34
    }, ("TURBOPACK compile-time value", void 0));
const TabsTrigger = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
        type: "button",
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/tabs.tsx",
        lineNumber: 10,
        columnNumber: 23
    }, ("TURBOPACK compile-time value", void 0));
const TabsContent = ({ children, className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/tabs.tsx",
        lineNumber: 13,
        columnNumber: 34
    }, ("TURBOPACK compile-time value", void 0));
const __TURBOPACK__default__export__ = Tabs;
}),
"[project]/frontend/src/components/ui/dialog.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogContent",
    ()=>DialogContent,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const Dialog = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: children
    }, void 0, false);
const DialogTrigger = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: children
    }, void 0, false);
const DialogContent = ({ children, className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/dialog.tsx",
        lineNumber: 10,
        columnNumber: 34
    }, ("TURBOPACK compile-time value", void 0));
const DialogHeader = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "mb-4",
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/dialog.tsx",
        lineNumber: 13,
        columnNumber: 23
    }, ("TURBOPACK compile-time value", void 0));
const DialogTitle = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
        className: "text-xl font-bold",
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/dialog.tsx",
        lineNumber: 16,
        columnNumber: 23
    }, ("TURBOPACK compile-time value", void 0));
const __TURBOPACK__default__export__ = Dialog;
}),
"[project]/frontend/src/contexts/ThemeContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const ThemeContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"](undefined);
const ThemeProvider = ({ defaultTheme = "light", children })=>{
    const [theme, setTheme] = __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"](defaultTheme);
    const value = __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"](()=>({
            theme,
            setTheme
        }), [
        theme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/contexts/ThemeContext.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const useTheme = ()=>{
    const ctx = __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"](ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};
const __TURBOPACK__default__export__ = ThemeProvider;
}),
"[project]/frontend/src/_core/trpcClient.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "trpc",
    ()=>trpc
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$trpc$2f$client__$5b$external$5d$__$2840$trpc$2f$client$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@trpc/client [external] (@trpc/client, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$trpc$2f$client__$5b$external$5d$__$2840$trpc$2f$client$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$trpc$2f$client__$5b$external$5d$__$2840$trpc$2f$client$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const trpc = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$trpc$2f$client__$5b$external$5d$__$2840$trpc$2f$client$2c$__esm_import$29$__["createTRPCProxyClient"])({
    links: [
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$trpc$2f$client__$5b$external$5d$__$2840$trpc$2f$client$2c$__esm_import$29$__["httpBatchLink"])({
            url: 'http://localhost:8081/trpc',
            fetch: (input, init)=>{
                return fetch(input, {
                    ...init,
                    credentials: 'include'
                });
            }
        })
    ]
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend/src/_core/contexts/AuthContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuthContext",
    ()=>useAuthContext
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$_core$2f$trpcClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/_core/trpcClient.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$_core$2f$trpcClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$_core$2f$trpcClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const refresh = async ()=>{
        try {
            const me = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$_core$2f$trpcClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["trpc"].auth.me.query();
            setUser(me ?? null);
        } catch  {
            setUser(null);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$_core$2f$trpcClient$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["trpc"].auth.logout.mutate();
        } finally{
            setUser(null);
        }
    };
    const value = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>({
            user,
            loading,
            setUser,
            logout,
            refresh
        }), [
        user,
        loading
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/_core/contexts/AuthContext.tsx",
        lineNumber: 54,
        columnNumber: 10
    }, this);
}
function useAuthContext() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
    return ctx;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend/src/utils/text-analysis/ssmlUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// frontend/src/utils/text-analysis/ssmlUtils.ts
__turbopack_context__.s([
    "addPauses",
    ()=>addPauses,
    "formatFormulaForSSML",
    ()=>formatFormulaForSSML,
    "wrapInSSML",
    ()=>wrapInSSML
]);
function wrapInSSML(text) {
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis">${text}</speak>`;
}
function addPauses(text) {
    return text.replace(/([.,;])/g, '$1<break time="200ms"/>').replace(/\?/g, '?<break time="300ms"/>').replace(/!/g, '!<break time="300ms"/>');
}
function formatFormulaForSSML(formula, isMatrix = false) {
    const rate = isMatrix ? '70%' : '80%';
    return `<prosody rate="${rate}">the formula: <emphasis level="moderate">${formula}</emphasis></prosody><break time="300ms"/>`;
}
}),
"[project]/frontend/src/utils/text-analysis/grammarChecker.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// frontend/src/utils/text-analysis/grammarChecker.ts
__turbopack_context__.s([
    "checkGrammar",
    ()=>checkGrammar
]);
function checkGrammar(text) {
    const issues = [];
    // Tokenize into sentences
    const sentences = text.match(/[^.!?]+[.!?]/g) || [
        text
    ];
    sentences.forEach((sentence, sentIndex)=>{
        const words = sentence.trim().split(/\s+/);
        const sentStart = text.indexOf(sentence);
        // Rule 1: Subject-verb agreement
        for(let i = 0; i < words.length - 1; i++){
            const subject = words[i].toLowerCase();
            const verb = words[i + 1].toLowerCase();
            if ([
                'he',
                'she',
                'it'
            ].includes(subject) && !verb.endsWith('s')) {
                issues.push({
                    type: 'subject-verb',
                    message: 'Subject-verb agreement issue: Singular subject may need verb ending in "s"',
                    start: sentStart + sentence.indexOf(verb),
                    end: sentStart + sentence.indexOf(verb) + verb.length,
                    suggestion: verb + 's',
                    severity: 'medium'
                });
            }
        }
        // Rule 2: Missing end punctuation
        if (!/[.!?]$/.test(sentence)) {
            issues.push({
                type: 'punctuation',
                message: 'Missing end punctuation',
                start: sentStart + sentence.length - 1,
                end: sentStart + sentence.length,
                suggestion: sentence + '.',
                severity: 'low'
            });
        }
        // Rule 3: Passive voice detection
        const passiveRegex = /\b(is|was|were|been)\s+(\w+ed|\w+en)\b/gi;
        let match;
        while(match = passiveRegex.exec(sentence)){
            const contextWords = sentence.split(' ').slice(Math.max(0, match.index - 10), match.index + 10).join(' ');
            issues.push({
                type: 'passive-voice',
                message: 'Passive voice detected. Consider using active voice for clarity.',
                start: sentStart + match.index,
                end: sentStart + match.index + match[0].length,
                suggestion: `Consider: "${contextWords.replace(match[0], `${match[2]} ${match[1]}`)}"`,
                severity: 'medium'
            });
        }
        // Rule 4: Long sentences
        if (words.length > 25) {
            issues.push({
                type: 'readability',
                message: 'Sentence may be too long. Consider breaking it into smaller sentences.',
                start: sentStart,
                end: sentStart + sentence.length,
                severity: 'low'
            });
        }
    });
    return issues;
}
}),
"[project]/frontend/src/utils/text-analysis/formulaDetector.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// frontend/src/utils/text-analysis/formulaDetector.ts
__turbopack_context__.s([
    "detectFormulas",
    ()=>detectFormulas,
    "latexToSpeech",
    ()=>latexToSpeech,
    "parseMatrixContentRecursive",
    ()=>parseMatrixContentRecursive
]);
function parseMatrixContentRecursive(content) {
    let processedContent = content;
    const nestedMatrices = [];
    // Recursively find and parse inner matrices
    const innerMatrixRegex = /\\begin\{([pb]?matrix)\}([\s\S]*?)\\end\{\1\}/g;
    let innerMatch;
    let lastIndex = 0;
    let matchResult;
    // Process all nested matrices
    while((matchResult = innerMatrixRegex.exec(processedContent)) !== null){
        const innerContent = matchResult[2];
        const nested = parseMatrixContentRecursive(innerContent);
        nestedMatrices.push(nested);
        // Replace inner with placeholder for row splitting
        processedContent = processedContent.replace(matchResult[0], `[nested_${nestedMatrices.length - 1}]`);
        // Reset regex lastIndex due to string modification
        innerMatrixRegex.lastIndex = 0;
    }
    // Parse rows with placeholders
    const rows = processedContent.trim().split('\\\\').map((row)=>row.trim().split('&').map((cell)=>cell.trim()).filter(Boolean)).filter((row)=>row.length > 0); // Remove empty rows
    const m = rows.length;
    const n = rows[0]?.length || 0;
    if (m > 0 && rows.some((row)=>row.length !== n)) {
        throw new Error('Inconsistent matrix columns');
    }
    return {
        rows,
        nestedMatrices,
        type: innerMatch?.[1]?.includes('p') ? 'parenthesized' : innerMatch?.[1]?.includes('b') ? 'bracketed' : 'plain',
        dimensions: {
            m,
            n
        }
    };
}
function detectFormulas(text) {
    const formulaPatterns = [
        {
            regex: /\$\$([^$]+)\$\$/g,
            type: "display"
        },
        {
            regex: /\$([^$]+)\$/g,
            type: "inline"
        },
        {
            regex: /\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g,
            type: "display"
        },
        {
            regex: /\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g,
            type: "display"
        },
        {
            regex: /\\begin\{([pb]?matrix)\}([\s\S]*?)\\end\{\1\}/g,
            type: "display"
        },
        {
            regex: /\\begin\{vmatrix\}([\s\S]*?)\\end\{vmatrix\}/g,
            type: "display"
        },
        {
            regex: /\\vec\{([^}]+)\}/g,
            type: "inline"
        },
        {
            regex: /\\lim_\{([^}]+)\}/g,
            type: "inline"
        },
        {
            regex: /\\sum_\{([^}]+)\}\^\{([^}]+)\}/g,
            type: "display"
        },
        {
            regex: /\\prod_\{([^}]+)\}\^\{([^}]+)\}/g,
            type: "display"
        },
        {
            regex: /\\mathbf\{([^}]+)\}/g,
            type: "inline"
        }
    ];
    const formulas = [];
    for (const { regex, type } of formulaPatterns){
        let match;
        while((match = regex.exec(text)) !== null){
            const fullMatch = match[0];
            const content = match[1] || match[2] || fullMatch;
            let matrixData;
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
                spoken: '',
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
    return formulas.map((formula)=>({
            ...formula,
            spoken: latexToSpeech(formula.latex, formula.matrixData)
        }));
}
function latexToSpeech(latex, matrixData) {
    if (matrixData) {
        const { rows, dimensions, nestedMatrices } = matrixData;
        let desc = `a ${dimensions.m} by ${dimensions.n} matrix`;
        if (nestedMatrices.length > 0) {
            desc += ' containing nested matrices. ';
        } else {
            desc += ' with elements: ';
        }
        const rowDescs = rows.map((row, i)=>{
            const cellDescs = row.map((cell)=>{
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
    let spoken = latex.replace(/\\vec\{([^}]+)\}/g, 'vector $1').replace(/\\det/g, 'determinant of').replace(/\\lim_\{([^}]+)\}([^ ]*)/g, 'limit as $1 of $2').replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}([^ ]*)/g, 'sum from $1 to $2 of $3').replace(/\\prod_\{([^}]+)\}\^\{([^}]+)\}([^ ]*)/g, 'product from $1 to $2 of $3').replace(/\\mathbf\{([^}]+)\}/g, 'bold $1').replace(/\\begin\{vmatrix\}([\s\S]*?)\\end\{vmatrix\}/g, 'determinant of $1')// ... (keep other existing replacements)
    .trim();
    return spoken;
}
}),
"[project]/frontend/src/utils/math/sympyService.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// frontend/src/utils/math/sympyService.ts
__turbopack_context__.s([
    "checkSympyServer",
    ()=>checkSympyServer,
    "evaluateWithSympy",
    ()=>evaluateWithSympy
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const SYMPY_SERVER_URL = 'http://localhost:5000';
async function evaluateWithSympy(expression) {
    try {
        const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].post(`${SYMPY_SERVER_URL}/evaluate`, {
            expression: expression
        });
        return response.data;
    } catch (error) {
        console.error('Error evaluating with SymPy:', error);
        return {
            result: null,
            error: error.response?.data?.error || error.message
        };
    }
}
// Example usage:
// In your component or service:
async function handleMathExpression(expr) {
    const { result, error, latex } = await evaluateWithSympy(expr);
    if (error) {
        console.error('Evaluation failed:', error);
        return;
    }
    console.log('Result:', result);
    console.log('LaTeX:', latex);
// Update your UI with the result
}
async function checkSympyServer() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].get('http://localhost:5000/evaluate', {
            timeout: 1000,
            validateStatus: ()=>true // Don't throw on 404
        });
        return true;
    } catch  {
        return false;
    }
}
// Usage:
const isAvailable = await checkSympyServer();
if (!isAvailable) {
// Fall back to mathjs or show a message to the user
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/frontend/src/utils/math/matrixOperations.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// frontend/src/utils/math/matrixOperations.ts
__turbopack_context__.s([
    "buildMathjsMatrix",
    ()=>buildMathjsMatrix,
    "validateMatrixEquation",
    ()=>validateMatrixEquation
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mathjs__$5b$external$5d$__$28$mathjs$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/mathjs [external] (mathjs, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$mathjs__$5b$external$5d$__$28$mathjs$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$mathjs__$5b$external$5d$__$28$mathjs$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
function buildMathjsMatrix(data) {
    const rows = data.rows.map((row)=>row.map((cell)=>{
            if (cell.startsWith('[nested_')) {
                const idx = parseInt(cell.match(/\d+/)?.[0] || '0', 10);
                return buildMathjsMatrix(data.nestedMatrices[idx]);
            }
            try {
                // Try to evaluate if it's a number or simple expression
                return Number(cell) || cell;
            } catch  {
                return cell;
            }
        }));
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mathjs__$5b$external$5d$__$28$mathjs$2c$__esm_import$29$__["matrix"])(rows);
}
function validateMatrixEquation(latex) {
    try {
        // Simple check for matrix equation (A = B * C)
        if (latex.includes('=')) {
            const [left, right] = latex.split('=').map((s)=>s.trim());
            // This is a simplified example - in reality, you'd need a proper parser
            // to handle arbitrary matrix equations
            return {
                isValid: true,
                solution: {
                    message: 'Matrix equation validation not fully implemented',
                    type: 'matrix_equation'
                }
            };
        }
        // Handle determinants
        const detMatch = latex.match(/\\begin\{vmatrix\}([\s\S]*?)\\end\{vmatrix\}/);
        if (detMatch) {
            const matrixData = parseMatrixContentRecursive(detMatch[1]);
            const mat = buildMathjsMatrix(matrixData);
            const determinant = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mathjs__$5b$external$5d$__$28$mathjs$2c$__esm_import$29$__["det"])(mat);
            return {
                isValid: true,
                solution: {
                    type: 'determinant',
                    value: determinant,
                    matrix: mat.toArray()
                }
            };
        }
        return {
            isValid: false,
            solution: null,
            error: 'Unsupported operation'
        };
    } catch (error) {
        return {
            isValid: false,
            solution: null,
            error: error.message
        };
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend/src/utils/text-analysis/mathValidator.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// frontend/src/utils/text-analysis/mathValidator.ts
__turbopack_context__.s([
    "extractMathExpressions",
    ()=>extractMathExpressions,
    "validateMath",
    ()=>validateMath,
    "validateMathExpression",
    ()=>validateMathExpression
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$formulaDetector$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/utils/text-analysis/formulaDetector.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$math$2f$sympyService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/utils/math/sympyService.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$math$2f$matrixOperations$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/utils/math/matrixOperations.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$math$2f$sympyService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$math$2f$matrixOperations$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$math$2f$sympyService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$math$2f$matrixOperations$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function validateMathExpression(expression) {
    try {
        const { result, error, latex } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$math$2f$sympyService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["evaluateWithSympy"])(expression);
        if (error) {
            return {
                isValid: false,
                solution: null,
                error: `SymPy evaluation error: ${error}`
            };
        }
        return {
            isValid: true,
            solution: {
                value: result,
                latex: latex || expression,
                type: 'symbolic'
            }
        };
    } catch (error) {
        return {
            isValid: false,
            solution: null,
            error: `Failed to evaluate expression: ${error.message}`
        };
    }
}
async function validateMath(latex) {
    try {
        // Try matrix operations first
        if (latex.includes('matrix') || latex.includes('vmatrix') || latex.includes('=')) {
            const matrixResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$math$2f$matrixOperations$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["validateMatrixEquation"])(latex);
            if (matrixResult.isValid) {
                return matrixResult;
            }
        }
        // Fall back to regular math validation
        return await validateMathExpression(latex);
    } catch (error) {
        return {
            isValid: false,
            solution: null,
            error: error.message
        };
    }
}
function extractMathExpressions(text) {
    const formulas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$formulaDetector$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["detectFormulas"])(text);
    return formulas.map((formula)=>({
            expression: formula.latex,
            start: formula.position.start,
            end: formula.position.end,
            type: formula.type,
            spoken: formula.spoken
        }));
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend/src/utils/text-analysis/scientificValidator.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// frontend/src/utils/text-analysis/scientificValidator.ts
__turbopack_context__.s([
    "checkScientificAccuracy",
    ()=>checkScientificAccuracy
]);
// Common scientific inaccuracies
const SCIENTIFIC_RULES = [
    {
        pattern: /\b(centrifugal force)\b/gi,
        message: 'Centrifugal force is a fictitious force that appears in rotating reference frames',
        suggestion: 'centripetal force (if referring to the real force)',
        type: 'physics',
        severity: 'high'
    },
    {
        pattern: /\b(theory)\s+(of\s+)?(evolution|relativity|big bang)\b/gi,
        message: 'In science, a theory is a well-substantiated explanation',
        suggestion: 'scientific theory',
        type: 'terminology',
        severity: 'medium'
    },
    {
        pattern: /\b(electrons?)\s+orbit(ing)?\s+(the )?nucleus\b/gi,
        message: 'Electrons exist in probability clouds (orbitals) rather than fixed orbits',
        type: 'physics',
        severity: 'high'
    }
];
function checkScientificAccuracy(text) {
    const issues = [];
    SCIENTIFIC_RULES.forEach((rule)=>{
        let match;
        while((match = rule.pattern.exec(text)) !== null){
            issues.push({
                type: rule.type,
                message: rule.message,
                start: match.index,
                end: match.index + match[0].length,
                suggestion: rule.suggestion,
                severity: rule.severity
            });
        }
    });
    return issues;
}
}),
"[project]/frontend/src/utils/text-analysis/textAnalyzer.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// frontend/src/utils/text-analysis/textAnalyzer.ts
__turbopack_context__.s([
    "analyzeText",
    ()=>analyzeText,
    "processTextWithSSML",
    ()=>processTextWithSSML
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$ssmlUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/utils/text-analysis/ssmlUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$grammarChecker$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/utils/text-analysis/grammarChecker.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$mathValidator$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/utils/text-analysis/mathValidator.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$scientificValidator$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/utils/text-analysis/scientificValidator.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$mathValidator$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$mathValidator$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function processTextWithSSML(text, formulas) {
    let result = text;
    // Process in reverse order to preserve positions
    const sortedFormulas = [
        ...formulas
    ].sort((a, b)=>b.position.start - a.position.start);
    for (const formula of sortedFormulas){
        const before = result.substring(0, formula.position.start);
        const after = result.substring(formula.position.end);
        const ssmlFormula = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$ssmlUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatFormulaForSSML"])(formula.spoken, !!formula.matrixData);
        result = before + ssmlFormula + after;
    }
    // Add pauses and wrap in SSML
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$ssmlUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["wrapInSSML"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$ssmlUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["addPauses"])(result));
}
async function analyzeText(text) {
    // Run all validations in parallel
    const [grammarIssues, scientificIssues] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$grammarChecker$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["checkGrammar"])(text),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$scientificValidator$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["checkScientificAccuracy"])(text)
    ]);
    // Process math expressions with enhanced detection
    const mathExpressions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$mathValidator$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["extractMathExpressions"])(text);
    const mathIssues = mathExpressions.map((expr)=>({
            ...expr,
            result: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$utils$2f$text$2d$analysis$2f$mathValidator$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["validateMathExpression"])(expr.expression)
        }));
    // Extract all formulas for highlighting
    const formulas = mathExpressions.map((expr)=>({
            latex: expr.expression,
            type: expr.type,
            start: expr.start,
            end: expr.end,
            spoken: expr.spoken || ''
        }));
    return {
        grammarIssues,
        mathIssues,
        scientificIssues,
        formulas
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend/src/App.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$sonner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/src/components/ui/sonner.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/sonner [external] (sonner, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/ui/tooltip.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$NotFound$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/NotFound.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/wouter [external] (wouter, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ErrorBoundary$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/ErrorBoundary.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/contexts/ThemeContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$_core$2f$contexts$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/_core/contexts/AuthContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Home$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/Home.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Library$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/Library.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Dashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/Dashboard.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Wallet$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/Wallet.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$BookDetails$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/BookDetails.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Referrals$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/Referrals.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Gifts$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/Gifts.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$CreateBook$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/CreateBook.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerDashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/SellerDashboard.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdvancedSellerRegistration$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/AdvancedSellerRegistration.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AudiobookCreator$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/AudiobookCreator.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerRegistration$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/SellerRegistration.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerOnboarding$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/SellerOnboarding.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Register$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/Register.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerRequest$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/SellerRequest.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdminDashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/AdminDashboard.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$BookEditor$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/BookEditor.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdminBookManagement$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/AdminBookManagement.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$ReadingAnalytics$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/ReadingAnalytics.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdminWalletManagement$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/AdminWalletManagement.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Checkout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/pages/Checkout.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$sonner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$_core$2f$contexts$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Home$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Library$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Wallet$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$BookDetails$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Referrals$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerDashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdvancedSellerRegistration$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AudiobookCreator$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerRegistration$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerOnboarding$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Register$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerRequest$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdminDashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$BookEditor$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$ReadingAnalytics$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Checkout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$sonner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$_core$2f$contexts$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Home$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Library$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Wallet$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$BookDetails$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Referrals$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerDashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdvancedSellerRegistration$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AudiobookCreator$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerRegistration$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerOnboarding$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Register$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerRequest$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdminDashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$BookEditor$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$ReadingAnalytics$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Checkout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function Router() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Switch"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Home$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/library",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Library$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/book/:id",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$BookDetails$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/dashboard",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Dashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/wallet",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Wallet$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/referrals",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Referrals$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/gifts",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Gifts$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/create-book",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$CreateBook$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/seller-dashboard",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerDashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/audiobook-creator",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AudiobookCreator$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/seller-registration",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerRegistration$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/advanced-seller-registration",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdvancedSellerRegistration$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/seller-onboarding",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerOnboarding$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/register",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Register$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/seller-request",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$SellerRequest$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/admin-dashboard",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdminDashboard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/book-editor/:id",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$BookEditor$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/admin-book-management",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdminBookManagement$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/reading-analytics",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$ReadingAnalytics$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/admin-wallet-management",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$AdminWalletManagement$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/checkout",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$Checkout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                path: "/404",
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$NotFound$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$wouter__$5b$external$5d$__$28$wouter$2c$__esm_import$29$__["Route"], {
                component: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$pages$2f$NotFound$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/App.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function App() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ErrorBoundary$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
            defaultTheme: "light",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["TooltipProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$_core$2f$contexts$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$sonner__$5b$external$5d$__$28$sonner$2c$__esm_import$29$__["Toaster"], {}, void 0, false, {
                            fileName: "[project]/frontend/src/App.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Router, {}, void 0, false, {
                            fileName: "[project]/frontend/src/App.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/App.tsx",
                    lineNumber: 66,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/src/App.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/src/App.tsx",
            lineNumber: 64,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/src/App.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = App;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/frontend/src/App.tsx [ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/src/App.tsx [ssr] (ecmascript)"));
}),
];

//# sourceMappingURL=frontend_src_d60851ac._.js.map