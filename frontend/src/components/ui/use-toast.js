"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastProvider = ToastProvider;
exports.useToast = useToast;
const React = __importStar(require("react"));
const ToastContext = React.createContext(null);
function ToastProvider({ children }) {
    const [toasts, setToasts] = React.useState([]);
    const toast = React.useCallback(({ duration = 5000, ...props }) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prevToasts) => [...prevToasts, { id, ...props }]);
        if (duration) {
            setTimeout(() => {
                setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
            }, duration);
        }
    }, []);
    const dismissToast = React.useCallback((id) => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, []);
    return (<ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast}/>
    </ToastContext.Provider>);
}
function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
function ToastViewport({ toasts, onDismiss, }) {
    return (<div className="fixed top-0 right-0 z-50 flex flex-col p-4 space-y-2 max-h-screen overflow-hidden">
      {toasts.map((toast) => (<ToastItem key={toast.id} toast={toast} onDismiss={onDismiss}/>))}
    </div>);
}
function ToastItem({ toast, onDismiss, }) {
    const { id, title, description, type = "default" } = toast;
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(id);
        }, toast.duration || 5000);
        return () => clearTimeout(timer);
    }, [id, onDismiss, toast.duration]);
    return (<div className={`relative flex flex-col p-4 rounded-lg shadow-lg min-w-[300px] max-w-md ${type === "destructive"
            ? "bg-red-100 text-red-900"
            : "bg-white text-gray-900"}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <button onClick={() => onDismiss(id)} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      {description && (<p className="mt-1 text-sm text-gray-600">{description}</p>)}
    </div>);
}
