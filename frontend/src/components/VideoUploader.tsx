// components/VideoUploader.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

interface VideoUploaderProps {
  onUploadComplete: (videoId: string, metadata: any) => void;
  userId: string;
  bookId?: string;
  maxFileSize?: number; // in bytes, default 5GB
  acceptedTypes?: string[];
}

interface UploadState {
  uploadId: string | null;
  progress: number;
  status: 'idle' | 'validating' | 'uploading' | 'processing' | 'completed' | 'error';
  error: string | null;
  chunksUploaded: number;
  totalChunks: number;
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_CONCURRENT_UPLOADS = 2;

export function VideoUploader({
  onUploadComplete,
  userId,
  maxFileSize = 5 * 1024 * 1024 * 1024,
  acceptedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
}: VideoUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploadId: null,
    progress: 0,
    status: 'idle',
    error: null,
    chunksUploaded: 0,
    totalChunks: 0
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file
    if (file.size > maxFileSize) {
      toast.error(`File too large. Max: ${formatBytes(maxFileSize)}`);
      return;
    }
    
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Unsupported format. Allowed: ${acceptedTypes.join(', ')}`);
      return;
    }

    await startUpload(file);
  }, [maxFileSize, acceptedTypes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': acceptedTypes },
    multiple: false,
    disabled: uploadState.status !== 'idle' && uploadState.status !== 'error',
    maxSize: maxFileSize
  });

  // Start upload process
  const startUpload = async (file: File) => {
    setUploadState(prev => ({ ...prev, status: 'validating', error: null }));
    
    try {
      // 1. Init upload session
      const initResponse = await fetch('/api/upload/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          mimeType: file.type,
          totalChunks: Math.ceil(file.size / CHUNK_SIZE),
          userId,
          bookId
        })
      });

      if (!initResponse.ok) {
        throw new Error('Failed to initialize upload');
      }

      const { uploadId, chunkSize } = await initResponse.json();
      
      setUploadState({
        uploadId,
        progress: 0,
        status: 'uploading',
        error: null,
        chunksUploaded: 0,
        totalChunks: Math.ceil(file.size / CHUNK_SIZE)
      });

      // 2. Upload chunks with concurrency control
      await uploadChunks(file, uploadId, chunkSize);

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: error.message || 'Upload failed'
      }));
      toast.error(error.message || 'Upload failed');
    }
  };

  // Upload chunks with concurrency limiting
  const uploadChunks = async (file: File, uploadId: string, chunkSize: number) => {
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    let uploaded = 0;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    
    // Process chunks with limited concurrency
    const processChunk = async (index: number): Promise<void> => {
      const start = index * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      const formData = new FormData();
      formData.append('chunk', chunk, `chunk_${index}`);
      formData.append('index', index.toString());
      
      const response = await fetch(`/api/upload/chunk/${uploadId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formData,
        signal
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `Chunk ${index} upload failed`);
      }
      
      const result = await response.json();
      
      // Update progress
      uploaded++;
      const progress = Math.round((uploaded / totalChunks) * 100);
      
      setUploadState(prev => ({
        ...prev,
        progress,
        chunksUploaded: uploaded
      }));
      
      // If upload completed, start processing
      if (result.status === 'completed' && result.jobId) {
        setUploadState(prev => ({ ...prev, status: 'processing' }));
        await pollJobStatus(result.jobId);
      }
    };
    
    // Execute with concurrency control
    const executeWithConcurrency = async (
      tasks: Array<() => Promise<void>>,
      concurrency: number
    ): Promise<void> => {
      const executing: Promise<void>[] = [];
      
      for (const task of tasks) {
        const promise = task().then(() => {
          executing.splice(executing.indexOf(promise), 1);
        });
        executing.push(promise);
        
        if (executing.length >= concurrency) {
          await Promise.race(executing);
        }
      }
      await Promise.all(executing);
    };
    
    // Create chunk upload tasks
    const tasks = Array.from({ length: totalChunks }, (_, i) =>
      () => processChunk(i)
    );
    
    try {
      await executeWithConcurrency(tasks, MAX_CONCURRENT_UPLOADS);
      
      setUploadState(prev => ({ ...prev, status: 'completed' }));
      toast.success('Upload complete! Processing started.');
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Upload cancelled');
        return;
      }
      throw error;
    }
  };

  // Poll for job completion
  const pollJobStatus = async (jobId: string): Promise<void> => {
    const poll = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/videos/${jobId}/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch status');
        
        const status = await response.json();
        
        if (status.status === 'completed') {
          onUploadComplete(jobId, status.output);
          toast.success('Video processing complete!');
        } else if (status.status === 'failed') {
          throw new Error(status.error || 'Processing failed');
        } else {
          // Continue polling
          setUploadState(prev => ({
            ...prev,
            progress: status.progress || prev.progress
          }));
          setTimeout(poll, 5000); // Poll every 5 seconds
        }
      } catch (error: any) {
        setUploadState(prev => ({
          ...prev,
          status: 'error',
          error: error.message
        }));
        toast.error(error.message || 'Failed to check processing status');
      }
    };
    
    setTimeout(poll, 2000); // Initial delay
  };

  // Cancel upload
  const cancelUpload = () => {
    abortControllerRef.current?.abort();
    setUploadState(prev => ({ ...prev, status: 'idle', progress: 0 }));
    toast('Upload cancelled');
  };

  // Format bytes for display
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors 
          ${isDragActive 
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400' 
          }
          ${(uploadState.status !== 'idle' && uploadState.status !== 'error') 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
          }
        `}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        
        {uploadState.status === 'idle' || uploadState.status === 'error' ? (
          <>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isDragActive ? 'Drop your video here...' : 'Drag & drop a video file, or click to browse'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              MP4, MOV, AVI • Max {formatBytes(maxFileSize)}
            </p>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-purple-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {uploadState.status === 'uploading' && `Uploading: ${uploadState.progress}%`}
                {uploadState.status === 'processing' && 'Processing video...'}
                {uploadState.status === 'completed' && '✓ Complete!'}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  uploadState.status === 'error' ? 'bg-red-500' : 'bg-purple-600'
                }`}
                style={{ width: `${uploadState.progress}%` }}
              />
            </div>
            
            {/* Cancel Button */}
            {(uploadState.status === 'uploading' || uploadState.status === 'processing') && (
              <button
                onClick={cancelUpload}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadState.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{uploadState.error}</p>
          <button
            onClick={() => setUploadState(prev => ({ ...prev, status: 'idle', error: null }))}
            className="mt-2 text-xs text-red-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Upload Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Use MP4 (H.264) for best compatibility</li>
          <li>Keep videos under 10 minutes for faster processing</li>
          <li>Stable internet connection recommended for large files</li>
        </ul>
      </div>
    </div>
  );
}
