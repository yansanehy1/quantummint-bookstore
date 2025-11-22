import React from 'react';
import { useAutoSaveForm } from '../../hooks/useAutoSaveForm';

type ProfileShape = {
  personalInfo: {
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;
  };
  businessInfo: {
    company?: string;
    position?: string;
  };
};

const initialProfile: ProfileShape = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
  },
  businessInfo: {
    company: '',
    position: '',
  },
};

export function UserProfileSettings() {
  // saveFn posts to /api/profile; hook will handle localStorage backup
  const saveFn = async (data: ProfileShape) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: data }),
      });
      if (!res.ok) {
        console.warn('Server profile save responded with', res.status);
      }
    } catch (err) {
      console.warn('Failed to persist profile to server (kept locally):', err);
    }
  };

  const {
    formData,
    isSaving,
    saveSuccess,
    restoredFromStorage,
    restoredAt,
    handlePersonalInfoChange,
    handleBusinessInfoChange,
    handleManualSave,
  } = useAutoSaveForm<ProfileShape>({ initialData: initialProfile, saveFn, storageKey: 'userProfileDraft', autoLoadFromStorage: true });

  return (
    <div className="max-w-3xl bg-white rounded p-6 shadow">
      <h1 className="text-2xl font-semibold mb-4">Profile Settings</h1>

      {restoredFromStorage && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800">
          Restored a local draft from {restoredAt ? new Date(restoredAt).toLocaleString() : 'a previous session'}.
        </div>
      )}

      <fieldset className="mb-4">
        <legend className="text-lg font-medium">Personal Information</legend>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <input
            aria-label="First name"
            placeholder="First name"
            value={formData.personalInfo.firstName}
            onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            aria-label="Last name"
            placeholder="Last name"
            value={formData.personalInfo.lastName}
            onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            aria-label="Email"
            placeholder="Email"
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            className="border rounded px-3 py-2 col-span-2"
          />
          <textarea
            aria-label="Short bio"
            placeholder="Short bio"
            value={formData.personalInfo.bio}
            onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
            className="border rounded px-3 py-2 col-span-2"
            rows={4}
          />
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="text-lg font-medium">Business Information</legend>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <input
            aria-label="Company"
            placeholder="Company"
            value={formData.businessInfo.company}
            onChange={(e) => handleBusinessInfoChange('company', e.target.value)}
            className="border rounded px-3 py-2 col-span-2"
          />
          <input
            aria-label="Position"
            placeholder="Position"
            value={formData.businessInfo.position}
            onChange={(e) => handleBusinessInfoChange('position', e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
      </fieldset>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'All changes saved locally'}
        </div>
        <div>
          <button
            onClick={handleManualSave}
            aria-label="Save profile now"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
