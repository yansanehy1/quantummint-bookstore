"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = apiRequest;
exports.uploadFile = uploadFile;
const react_1 = require("next-auth/react");
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
async function apiRequest(endpoint, options = {}) {
    const session = await (0, react_1.getSession)();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || 'An error occurred');
        error.status = response.status;
        error.data = errorData;
        throw error;
    }
    // Handle 204 No Content
    if (response.status === 204) {
        return {};
    }
    return response.json();
}
async function uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress(progress);
            }
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                }
                catch (error) {
                    reject(new Error('Failed to parse server response'));
                }
            }
            else {
                let errorMessage = 'Upload failed';
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    errorMessage = errorData.message || errorMessage;
                }
                catch (e) {
                    // Ignore JSON parse error
                }
                reject(new Error(errorMessage));
            }
        };
        xhr.onerror = () => {
            reject(new Error('Network error occurred'));
        };
        xhr.open('POST', `${API_BASE_URL}/upload`, true);
        const session = (0, react_1.getSession)();
        if (session) {
            xhr.setRequestHeader('Authorization', `Bearer ${session.accessToken}`);
        }
        xhr.send(formData);
    });
}
