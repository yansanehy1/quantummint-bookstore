(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/src/pages/SellerRegistration.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SellerRegistration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/ui/button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/ui/card.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/ui/input.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/book-open.js [client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/chevron-right.js [client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/upload.js [client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$wouter$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/wouter/esm/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
function SellerRegistration() {
    _s();
    const [, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$wouter$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useLocation"])();
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        businessName: "",
        businessType: "",
        businessDescription: "",
        businessWebsite: "",
        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        routingNumber: "",
        accountType: "checking",
        taxId: "",
        taxDocumentUrl: "",
        agreedToTerms: false,
        agreedToPrivacy: false
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const steps = [
        {
            id: 1,
            title: "Personal Information",
            description: "Your basic details",
            completed: false
        },
        {
            id: 2,
            title: "Business Profile",
            description: "About your business",
            completed: false
        },
        {
            id: 3,
            title: "Payment Method",
            description: "Bank account details",
            completed: false
        },
        {
            id: 4,
            title: "Tax Information",
            description: "Tax ID and documents",
            completed: false
        },
        {
            id: 5,
            title: "Review & Confirm",
            description: "Verify your information",
            completed: false
        }
    ];
    const handleInputChange = (e)=>{
        const { name, value, type } = e.target;
        const newValue = type === "checkbox" ? e.target.checked : value;
        setFormData((prev)=>({
                ...prev,
                [name]: newValue
            }));
        if (errors[name]) setErrors((prev)=>({
                ...prev,
                [name]: ""
            }));
    };
    const validateStep = (step)=>{
        const newErrors = {};
        switch(step){
            case 1:
                if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
                if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
                if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email is required";
                if (!formData.phone.match(/^\d{10,}$/)) newErrors.phone = "Valid phone number is required";
                if (!formData.country.trim()) newErrors.country = "Country is required";
                if (!formData.city.trim()) newErrors.city = "City is required";
                break;
            case 2:
                if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
                if (!formData.businessType) newErrors.businessType = "Business type is required";
                if (!formData.businessDescription.trim()) newErrors.businessDescription = "Business description is required";
                break;
            case 3:
                if (!formData.bankName.trim()) newErrors.bankName = "Bank name is required";
                if (!formData.accountHolderName.trim()) newErrors.accountHolderName = "Account holder name is required";
                if (!formData.accountNumber.match(/^\d{8,}$/)) newErrors.accountNumber = "Valid account number is required";
                if (!formData.routingNumber.match(/^\d{8,}$/)) newErrors.routingNumber = "Valid routing number is required";
                break;
            case 4:
                if (!formData.taxId.trim()) newErrors.taxId = "Tax ID is required";
                if (!formData.taxDocumentUrl) newErrors.taxDocumentUrl = "Tax document is required";
                break;
            case 5:
                if (!formData.agreedToTerms) newErrors.agreedToTerms = "You must agree to the terms";
                if (!formData.agreedToPrivacy) newErrors.agreedToPrivacy = "You must agree to the privacy policy";
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleNext = ()=>{
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };
    const handlePrevious = ()=>{
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!validateStep(currentStep)) return;
        setIsSubmitting(true);
        try {
            await new Promise((resolve)=>setTimeout(resolve, 2000));
            alert("Registration successful! Welcome to Sierra Books seller program.");
            setLocation("/seller-dashboard");
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleFileUpload = (e)=>{
        var _e_target_files;
        const file = (_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0];
        if (file) {
            setFormData((prev)=>({
                    ...prev,
                    taxDocumentUrl: "".concat(file.name, " (uploaded)")
                }));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-amber-50 to-orange-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white shadow-sm sticky top-0 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 cursor-pointer",
                            onClick: ()=>setLocation("/"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                    className: "w-8 h-8 text-amber-600"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-gray-900",
                                    children: "Sierra Books"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                    lineNumber: 163,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex gap-4 items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setLocation("/"),
                                    className: "text-gray-700 hover:text-amber-600 font-medium",
                                    children: "Home"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setLocation("/dashboard"),
                                    className: "text-gray-700 hover:text-amber-600 font-medium",
                                    children: "Dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                    lineNumber: 160,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container max-w-4xl mx-auto px-4 py-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mb-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-4xl font-bold text-gray-900 mb-4",
                                children: "Become a Seller"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl text-gray-600",
                                children: "Join thousands of educators sharing knowledge and earning income on Sierra Books."
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-4 gap-6 mb-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-6 sticky top-24",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-gray-900 mb-6",
                                            children: "Registration Steps"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                            lineNumber: 182,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: steps.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    onClick: ()=>setCurrentStep(s.id),
                                                    className: "p-3 rounded-lg cursor-pointer transition ".concat(currentStep === s.id ? "bg-amber-100 border-2 border-amber-600" : "bg-gray-50 hover:bg-gray-100"),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ".concat(currentStep >= s.id ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"),
                                                                children: currentStep > s.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                    className: "w-5 h-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                    lineNumber: 194,
                                                                    columnNumber: 47
                                                                }, this) : s.id
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 193,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "font-semibold text-sm text-gray-900",
                                                                        children: s.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 197,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-gray-600",
                                                                        children: s.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 198,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 196,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 21
                                                    }, this)
                                                }, s.id, false, {
                                                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                            lineNumber: 183,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-8",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSubmit,
                                        children: [
                                            currentStep === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-2xl font-bold text-gray-900 mb-6",
                                                        children: "Personal Information"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 214,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid md:grid-cols-2 gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                        children: "First Name *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 217,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                        name: "firstName",
                                                                        value: formData.firstName,
                                                                        onChange: handleInputChange,
                                                                        placeholder: "John",
                                                                        className: "h-10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 218,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    errors.firstName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-red-600 text-sm mt-1",
                                                                        children: errors.firstName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 219,
                                                                        columnNumber: 46
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 216,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                        children: "Last Name *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 222,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                        name: "lastName",
                                                                        value: formData.lastName,
                                                                        onChange: handleInputChange,
                                                                        placeholder: "Doe",
                                                                        className: "h-10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 223,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    errors.lastName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-red-600 text-sm mt-1",
                                                                        children: errors.lastName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 224,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 221,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Email Address *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 228,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                name: "email",
                                                                type: "email",
                                                                value: formData.email,
                                                                onChange: handleInputChange,
                                                                placeholder: "john@example.com",
                                                                className: "h-10"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 229,
                                                                columnNumber: 23
                                                            }, this),
                                                            errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-red-600 text-sm mt-1",
                                                                children: errors.email
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 230,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Phone Number *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 233,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                name: "phone",
                                                                value: formData.phone,
                                                                onChange: handleInputChange,
                                                                placeholder: "+1234567890",
                                                                className: "h-10"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 234,
                                                                columnNumber: 23
                                                            }, this),
                                                            errors.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-red-600 text-sm mt-1",
                                                                children: errors.phone
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 235,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid md:grid-cols-2 gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                        children: "Country *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 239,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        name: "country",
                                                                        value: formData.country,
                                                                        onChange: handleInputChange,
                                                                        className: "w-full px-3 py-2 border border-gray-300 rounded-lg",
                                                                        "aria-label": "Country",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "",
                                                                                children: "Select Country"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 241,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "Sierra Leone",
                                                                                children: "Sierra Leone"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 242,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "Guinea",
                                                                                children: "Guinea"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 243,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "Liberia",
                                                                                children: "Liberia"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 244,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "Mali",
                                                                                children: "Mali"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 245,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "Other",
                                                                                children: "Other"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 246,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 240,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    errors.country && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-red-600 text-sm mt-1",
                                                                        children: errors.country
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 248,
                                                                        columnNumber: 44
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 238,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                        children: "City *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 251,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                        name: "city",
                                                                        value: formData.city,
                                                                        onChange: handleInputChange,
                                                                        placeholder: "Freetown",
                                                                        className: "h-10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 252,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    errors.city && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-red-600 text-sm mt-1",
                                                                        children: errors.city
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 253,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 250,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                lineNumber: 213,
                                                columnNumber: 19
                                            }, this),
                                            currentStep === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-2xl font-bold text-gray-900 mb-6",
                                                        children: "Business Profile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 262,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Business Name *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 264,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                name: "businessName",
                                                                value: formData.businessName,
                                                                onChange: handleInputChange,
                                                                placeholder: "My Educational Content",
                                                                className: "h-10"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 265,
                                                                columnNumber: 23
                                                            }, this),
                                                            errors.businessName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-red-600 text-sm mt-1",
                                                                children: errors.businessName
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 266,
                                                                columnNumber: 47
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 263,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Business Type *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 269,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                name: "businessType",
                                                                value: formData.businessType,
                                                                onChange: handleInputChange,
                                                                className: "w-full px-3 py-2 border border-gray-300 rounded-lg",
                                                                "aria-label": "Business Type",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Select Business Type"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 271,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "individual",
                                                                        children: "Individual Creator"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 272,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "educator",
                                                                        children: "Educator/Teacher"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 273,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "publisher",
                                                                        children: "Publisher"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 274,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "organization",
                                                                        children: "Educational Organization"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 275,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "other",
                                                                        children: "Other"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 276,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 270,
                                                                columnNumber: 23
                                                            }, this),
                                                            errors.businessType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-red-600 text-sm mt-1",
                                                                children: errors.businessType
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 278,
                                                                columnNumber: 47
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 268,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Business Description *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 281,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                name: "businessDescription",
                                                                value: formData.businessDescription,
                                                                onChange: handleInputChange,
                                                                placeholder: "Tell us about your educational content and expertise...",
                                                                className: "w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 282,
                                                                columnNumber: 23
                                                            }, this),
                                                            errors.businessDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-red-600 text-sm mt-1",
                                                                children: errors.businessDescription
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 283,
                                                                columnNumber: 54
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Business Website (Optional)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 286,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                name: "businessWebsite",
                                                                value: formData.businessWebsite,
                                                                onChange: handleInputChange,
                                                                placeholder: "https://example.com",
                                                                className: "h-10"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 287,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                lineNumber: 261,
                                                columnNumber: 19
                                            }, this),
                                            currentStep === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-2xl font-bold text-gray-900 mb-6",
                                                        children: "Payment Method"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-700",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Secure Payment:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                    lineNumber: 297,
                                                                    columnNumber: 60
                                                                }, this),
                                                                " Your bank details are encrypted and securely stored. We never share your information with third parties."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                            lineNumber: 297,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Bank Name *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 300,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                name: "bankName",
                                                                value: formData.bankName,
                                                                onChange: handleInputChange,
                                                                placeholder: "Your Bank Name",
                                                                className: "h-10"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 301,
                                                                columnNumber: 23
                                                            }, this),
                                                            errors.bankName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-red-600 text-sm mt-1",
                                                                children: errors.bankName
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 302,
                                                                columnNumber: 43
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 299,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Account Holder Name *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 305,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                name: "accountHolderName",
                                                                value: formData.accountHolderName,
                                                                onChange: handleInputChange,
                                                                placeholder: "Full Name",
                                                                className: "h-10"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 306,
                                                                columnNumber: 23
                                                            }, this),
                                                            errors.accountHolderName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-red-600 text-sm mt-1",
                                                                children: errors.accountHolderName
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 307,
                                                                columnNumber: 52
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 304,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid md:grid-cols-2 gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                        children: "Account Number *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 311,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                        name: "accountNumber",
                                                                        value: formData.accountNumber,
                                                                        onChange: handleInputChange,
                                                                        placeholder: "Account Number",
                                                                        className: "h-10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 312,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    errors.accountNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-red-600 text-sm mt-1",
                                                                        children: errors.accountNumber
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 313,
                                                                        columnNumber: 50
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 310,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                        children: "Routing Number *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 316,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                        name: "routingNumber",
                                                                        value: formData.routingNumber,
                                                                        onChange: handleInputChange,
                                                                        placeholder: "Routing Number",
                                                                        className: "h-10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 317,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    errors.routingNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-red-600 text-sm mt-1",
                                                                        children: errors.routingNumber
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 318,
                                                                        columnNumber: 50
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 315,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Account Type *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 322,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                name: "accountType",
                                                                value: formData.accountType,
                                                                onChange: handleInputChange,
                                                                className: "w-full px-3 py-2 border border-gray-300 rounded-lg",
                                                                "aria-label": "Account Type",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "checking",
                                                                        children: "Checking"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 324,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "savings",
                                                                        children: "Savings"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 325,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                lineNumber: 294,
                                                columnNumber: 19
                                            }, this),
                                            currentStep === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-2xl font-bold text-gray-900 mb-6",
                                                        children: "Tax Information"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded mb-6",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-700",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Tax Compliance:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                    lineNumber: 336,
                                                                    columnNumber: 60
                                                                }, this),
                                                                " We require tax information to comply with local and international regulations."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                            lineNumber: 336,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Tax ID / NIN *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 339,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                name: "taxId",
                                                                value: formData.taxId,
                                                                onChange: handleInputChange,
                                                                placeholder: "Your Tax ID",
                                                                className: "h-10"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 340,
                                                                columnNumber: 23
                                                            }, this),
                                                            errors.taxId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-red-600 text-sm mt-1",
                                                                children: errors.taxId
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 341,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 338,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                children: "Tax Document *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 344,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                                        className: "w-12 h-12 text-gray-400 mx-auto mb-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 346,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "cursor-pointer",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "file",
                                                                                onChange: handleFileUpload,
                                                                                accept: ".pdf,.jpg,.png",
                                                                                className: "hidden"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 348,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm font-semibold text-gray-700 mb-1",
                                                                                children: "Click to upload or drag and drop"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 349,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-gray-600",
                                                                                children: "PDF, JPG, or PNG (Max 5MB)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 350,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 347,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 345,
                                                                columnNumber: 23
                                                            }, this),
                                                            formData.taxDocumentUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-green-600 text-sm mt-2",
                                                                children: [
                                                                    "✓ ",
                                                                    formData.taxDocumentUrl
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 353,
                                                                columnNumber: 51
                                                            }, this),
                                                            errors.taxDocumentUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-red-600 text-sm mt-1",
                                                                children: errors.taxDocumentUrl
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 354,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 343,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                lineNumber: 333,
                                                columnNumber: 19
                                            }, this),
                                            currentStep === 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-2xl font-bold text-gray-900 mb-6",
                                                        children: "Review & Confirm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 362,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Card"], {
                                                                className: "p-4 bg-gray-50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "font-bold text-gray-900 mb-3",
                                                                        children: "Personal Information"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 365,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid md:grid-cols-2 gap-4 text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-gray-600",
                                                                                        children: "Name"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 368,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "font-semibold text-gray-900",
                                                                                        children: [
                                                                                            formData.firstName,
                                                                                            " ",
                                                                                            formData.lastName
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 369,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 367,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-gray-600",
                                                                                        children: "Email"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 372,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "font-semibold text-gray-900",
                                                                                        children: formData.email
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 373,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 371,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-gray-600",
                                                                                        children: "Phone"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 376,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "font-semibold text-gray-900",
                                                                                        children: formData.phone
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 377,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 375,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-gray-600",
                                                                                        children: "Location"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 380,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "font-semibold text-gray-900",
                                                                                        children: [
                                                                                            formData.city,
                                                                                            ", ",
                                                                                            formData.country
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 381,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 379,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 366,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 364,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Card"], {
                                                                className: "p-4 bg-gray-50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "font-bold text-gray-900 mb-3",
                                                                        children: "Business Information"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 386,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-2 text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-gray-600",
                                                                                        children: "Business Name"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 389,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "font-semibold text-gray-900",
                                                                                        children: formData.businessName
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 390,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 388,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-gray-600",
                                                                                        children: "Business Type"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 393,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "font-semibold text-gray-900",
                                                                                        children: formData.businessType
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 394,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 392,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 387,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 385,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Card"], {
                                                                className: "p-4 bg-blue-50 border-2 border-blue-200",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "font-bold text-gray-900 mb-4",
                                                                        children: "Agreements"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 399,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "flex items-start gap-3 cursor-pointer",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "checkbox",
                                                                                        name: "agreedToTerms",
                                                                                        checked: formData.agreedToTerms,
                                                                                        onChange: handleInputChange,
                                                                                        className: "mt-1"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 402,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-sm text-gray-700",
                                                                                        children: [
                                                                                            "I agree to the ",
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                                href: "#",
                                                                                                className: "text-blue-600 font-semibold",
                                                                                                children: "Terms of Service"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                                lineNumber: 403,
                                                                                                columnNumber: 84
                                                                                            }, this),
                                                                                            " and ",
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                                href: "#",
                                                                                                className: "text-blue-600 font-semibold",
                                                                                                children: "Seller Agreement"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                                lineNumber: 403,
                                                                                                columnNumber: 161
                                                                                            }, this),
                                                                                            " *"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 403,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 401,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            errors.agreedToTerms && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-red-600 text-sm",
                                                                                children: errors.agreedToTerms
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 405,
                                                                                columnNumber: 52
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "flex items-start gap-3 cursor-pointer",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "checkbox",
                                                                                        name: "agreedToPrivacy",
                                                                                        checked: formData.agreedToPrivacy,
                                                                                        onChange: handleInputChange,
                                                                                        className: "mt-1"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 407,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-sm text-gray-700",
                                                                                        children: [
                                                                                            "I agree to the ",
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                                href: "#",
                                                                                                className: "text-blue-600 font-semibold",
                                                                                                children: "Privacy Policy"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                                lineNumber: 408,
                                                                                                columnNumber: 84
                                                                                            }, this),
                                                                                            " *"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                        lineNumber: 408,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 406,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            errors.agreedToPrivacy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-red-600 text-sm",
                                                                                children: errors.agreedToPrivacy
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                                lineNumber: 410,
                                                                                columnNumber: 54
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                        lineNumber: 400,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 398,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                lineNumber: 361,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-4 justify-between mt-8 pt-6 border-t border-gray-200",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        onClick: handlePrevious,
                                                        disabled: currentStep === 1,
                                                        variant: "outline",
                                                        children: "Previous"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 419,
                                                        columnNumber: 19
                                                    }, this),
                                                    currentStep < 5 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        onClick: handleNext,
                                                        className: "bg-amber-600 hover:bg-amber-700",
                                                        children: [
                                                            "Next",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                className: "w-4 h-4 ml-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                                lineNumber: 423,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 421,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "submit",
                                                        disabled: isSubmitting,
                                                        className: "bg-green-600 hover:bg-green-700 px-8",
                                                        children: isSubmitting ? "Registering..." : "Complete Registration"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                                lineNumber: 418,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                        lineNumber: 210,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                    lineNumber: 209,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/pages/SellerRegistration.tsx",
        lineNumber: 158,
        columnNumber: 5
    }, this);
}
_s(SellerRegistration, "/2x9eoDoer4oU5OxYkmba87FZgE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$wouter$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useLocation"]
    ];
});
_c = SellerRegistration;
var _c;
__turbopack_context__.k.register(_c, "SellerRegistration");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_src_pages_SellerRegistration_tsx_e8ca1ea0._.js.map