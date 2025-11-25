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
exports.DialogTitle = exports.DialogHeader = exports.DialogContent = exports.DialogTrigger = exports.Dialog = void 0;
const React = __importStar(require("react"));
const Dialog = ({ open, children }) => {
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center">
        {children}
      </div>);
};
exports.Dialog = Dialog;
const DialogTrigger = ({ children, onClick }) => <div onClick={onClick}>{children}</div>;
exports.DialogTrigger = DialogTrigger;
const DialogContent = ({ children, className }) => (<>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"/>
      <div className={`relative bg-white rounded-lg shadow-lg z-10 ${className || ''}`}>
        {children}
      </div>
    </>);
exports.DialogContent = DialogContent;
const DialogHeader = ({ children, className }) => <div className={`mb-4 ${className || ''}`}>{children}</div>;
exports.DialogHeader = DialogHeader;
const DialogTitle = ({ children, className }) => <h3 className={`text-xl font-bold ${className || ''}`}>{children}</h3>;
exports.DialogTitle = DialogTitle;
exports.default = exports.Dialog;
