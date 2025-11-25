"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDraftExample = FormDraftExample;
const react_1 = __importDefault(require("react"));
const useAutoSaveForm_1 = require("../../hooks/useAutoSaveForm");
const initialData = {
    title: '',
    description: '',
    personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
    },
    businessInfo: {
        company: '',
        position: '',
    },
};
function FormDraftExample() {
    // saveFn: attempt backend POST; hook will persist to localStorage when storageKey is provided
    const saveFn = async (data) => {
        try {
            const res = await fetch('/api/drafts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ draft: data }),
            });
            if (!res.ok) {
                console.warn('Server draft save responded with', res.status);
            }
        }
        catch (err) {
            // network error or no /api/drafts route: ignore, hook will keep local copy
            console.warn('Persisting draft to server failed (will keep local copy):', err);
        }
    };
    const { formData, isSaving, saveSuccess, restoredFromStorage, restoredAt, handleInputChange, handlePersonalInfoChange, handleBusinessInfoChange, handleManualSave, } = (0, useAutoSaveForm_1.useAutoSaveForm)({ initialData, saveFn, storageKey: 'formDraft', autoLoadFromStorage: true });
    return (<div className="bg-white rounded p-6 shadow space-y-4 max-w-2xl">
      <h2 className="text-xl font-semibold">Form Draft Example</h2>

      {restoredFromStorage && (<div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800">
          Restored draft from {restoredAt ? new Date(restoredAt).toLocaleString() : 'previous session'}.
        </div>)}

      <label className="block">
        <span className="text-sm font-medium">Title</span>
        <input value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" aria-label="Draft title"/>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Description</span>
        <textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" rows={4} aria-label="Draft description"/>
      </label>

      <fieldset className="border rounded p-3">
        <legend className="text-sm font-medium">Personal Info</legend>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input value={formData.personalInfo.firstName} onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)} placeholder="First name" className="border rounded px-2 py-1" aria-label="Personal first name"/>
          <input value={formData.personalInfo.lastName} onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)} placeholder="Last name" className="border rounded px-2 py-1" aria-label="Personal last name"/>
          <input value={formData.personalInfo.email} onChange={(e) => handlePersonalInfoChange('email', e.target.value)} placeholder="Email" className="border rounded px-2 py-1 col-span-2" aria-label="Personal email" type="email"/>
        </div>
      </fieldset>

      <fieldset className="border rounded p-3">
        <legend className="text-sm font-medium">Business Info</legend>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input value={formData.businessInfo.company} onChange={(e) => handleBusinessInfoChange('company', e.target.value)} placeholder="Company" className="border rounded px-2 py-1 col-span-2" aria-label="Company"/>
          <input value={formData.businessInfo.position} onChange={(e) => handleBusinessInfoChange('position', e.target.value)} placeholder="Position" className="border rounded px-2 py-1" aria-label="Position"/>
        </div>
      </fieldset>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'All changes saved locally'}
        </div>
        <div className="space-x-2">
          <button onClick={handleManualSave} className="px-3 py-1 bg-blue-600 text-white rounded" aria-label="Save now">
            Save Now
          </button>
        </div>
      </div>
    </div>);
}
