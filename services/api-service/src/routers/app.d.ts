export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../_core/trpc").Context;
    meta: object;
    errorShape: never;
    transformer: import("@trpc/server").DataTransformerOptions;
}>, {
    system: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../_core/trpc").Context;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        health: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _ctx_out: import("../_core/trpc").Context;
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: object;
        }, {
            status: "ok";
        }>;
    }>;
    auth: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../_core/trpc").Context;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        me: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _ctx_out: import("../_core/trpc").Context;
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: object;
        }, {
            id: number;
            role: import("../_core/trpc").Role;
            name?: string;
            email?: string;
        }>;
        logout: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _ctx_out: import("../_core/trpc").Context;
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: object;
        }, {
            readonly success: true;
        }>;
    }>;
    user: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../_core/trpc").Context;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        profile: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _ctx_out: import("../_core/trpc").Context;
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: object;
        }, {
            id: number;
            role: import("../_core/trpc").Role;
            name?: string;
            email?: string;
        }>;
        updateProfile: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                name?: string;
                email?: string;
                phone?: string;
            };
            _input_out: {
                name?: string;
                email?: string;
                phone?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
            readonly user: {
                id: number;
                role: import("../_core/trpc").Role;
                name?: string;
                email?: string;
            };
        }>;
    }>;
    wallet: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../_core/trpc").Context;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        getBalance: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly balanceUSD: "0.00";
            readonly balanceSLL: "0.00";
            readonly userId: number;
        }>;
        deposit: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                currency?: "USD" | "SLL";
                amount?: string;
                provider?: string;
            };
            _input_out: {
                currency?: "USD" | "SLL";
                amount?: string;
                provider?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
            readonly transactionId: string;
        }>;
        cashout: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                method?: string;
                currency?: "USD" | "SLL";
                amount?: string;
            };
            _input_out: {
                method?: string;
                currency?: "USD" | "SLL";
                amount?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
            readonly requestId: string;
        }>;
    }>;
    books: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../_core/trpc").Context;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: import("../_core/trpc").Context;
            _input_in: {
                search?: string;
                offset?: number;
                category?: string;
                limit?: number;
            };
            _input_out: {
                search?: string;
                offset?: number;
                category?: string;
                limit?: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly books: any[];
            readonly total: 0;
        }>;
        getDetails: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: import("../_core/trpc").Context;
            _input_in: {
                bookId?: number;
            };
            _input_out: {
                bookId?: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
        purchase: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                bookId?: number;
            };
            _input_out: {
                bookId?: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
            readonly purchaseId: string;
        }>;
        upload: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                title?: string;
                description?: string;
                category?: string;
                priceUSD?: string;
            };
            _input_out: {
                title?: string;
                description?: string;
                category?: string;
                priceUSD?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
            readonly bookId: 1;
        }>;
    }>;
    orders: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../_core/trpc").Context;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                bookId?: number;
                billingInfo?: {
                    address?: string;
                    email?: string;
                    phone?: string;
                    city?: string;
                    country?: string;
                    zipCode?: string;
                    fullName?: string;
                };
                currency?: "USD" | "SLL";
                amount?: string;
                paymentMethod?: string;
            };
            _input_out: {
                bookId?: number;
                billingInfo?: {
                    address?: string;
                    email?: string;
                    phone?: string;
                    city?: string;
                    country?: string;
                    zipCode?: string;
                    fullName?: string;
                };
                currency?: "USD" | "SLL";
                amount?: string;
                paymentMethod?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
            readonly orderId: string;
            readonly status: "completed";
            readonly amount: string;
            readonly currency: "USD" | "SLL";
        }>;
        getHistory: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                offset?: number;
                limit?: number;
            };
            _input_out: {
                offset?: number;
                limit?: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly orders: any[];
            readonly total: 0;
        }>;
        getDetails: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                orderId?: string;
            };
            _input_out: {
                orderId?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any>;
    }>;
    bookmarks: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../_core/trpc").Context;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                bookId?: number;
            };
            _input_out: {
                bookId?: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any[]>;
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                note?: string;
                bookId?: number;
                pageNumber?: number;
                audioTimestamp?: number;
            };
            _input_out: {
                note?: string;
                bookId?: number;
                pageNumber?: number;
                audioTimestamp?: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
            readonly bookmarkId: 1;
        }>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                bookmarkId?: number;
            };
            _input_out: {
                bookmarkId?: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
        }>;
    }>;
    referrals: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../_core/trpc").Context;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        getCode: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly code: string;
            readonly bonusUSD: "5.00";
        }>;
        invite: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                email?: string;
            };
            _input_out: {
                email?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
        }>;
    }>;
    gifts: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../_core/trpc").Context;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        send: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                note?: string;
                bookId?: number;
                recipientPhone?: string;
            };
            _input_out: {
                note?: string;
                bookId?: number;
                recipientPhone?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
            readonly giftCode: string;
        }>;
        claim: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: import("../_core/trpc").Context;
            _input_in: {
                giftCode?: string;
            };
            _input_out: {
                giftCode?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
            readonly bookId: 1;
        }>;
    }>;
    feedback: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../_core/trpc").Context;
        meta: object;
        errorShape: never;
        transformer: import("@trpc/server").DataTransformerOptions;
    }>, {
        submit: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: {
                type?: "feedback" | "bug" | "feature" | "support";
                rating?: number;
                message?: string;
                subject?: string;
            };
            _input_out: {
                type?: "feedback" | "bug" | "feature" | "support";
                rating?: number;
                message?: string;
                subject?: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            readonly success: true;
            readonly ticketId: string;
        }>;
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../_core/trpc").Context;
                meta: object;
                errorShape: never;
                transformer: import("@trpc/server").DataTransformerOptions;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: number;
                    role: import("../_core/trpc").Role;
                    name?: string;
                    email?: string;
                };
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
                res: import("express").Response<any, Record<string, any>>;
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, any[]>;
    }>;
}>;
export type AppRouter = typeof appRouter;
