'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Files } from 'lucide-react';

interface ResumeUploadProps {
  onUploadBatch: (files: File[]) => void;
  disabled?: boolean;
}

const MAX_FILES = 30;

export default function ResumeUpload({ onUploadBatch, disabled }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(isValidFileType).slice(0, MAX_FILES);
      if (validFiles.length > 0) {
        setSelectedFiles(prev => {
          const combined = [...prev, ...validFiles];
          return combined.slice(0, MAX_FILES);
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(isValidFileType).slice(0, MAX_FILES);
      if (validFiles.length > 0) {
        setSelectedFiles(prev => {
          const combined = [...prev, ...validFiles];
          return combined.slice(0, MAX_FILES);
        });
      }
    }
  };

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    return validTypes.includes(file.type);
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onUploadBatch(selectedFiles);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* File Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        {selectedFiles.length > 0 ? (
          <div className="space-y-3">
            <Files className="mx-auto h-10 w-10 text-primary-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                {selectedFiles.length >= MAX_FILES && ` (${MAX_FILES} max)`}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedFiles.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024 < 1
                  ? `${(selectedFiles.reduce((sum, f) => sum + f.size, 0) / 1024).toFixed(2)} KB total`
                  : `${(selectedFiles.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB total`}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="mt-2 text-red-500 hover:text-red-700 text-sm inline-flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop resumes here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Upload up to {MAX_FILES} files (PDF, DOC, DOCX, TXT)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-2 rounded text-sm"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="truncate text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Analyze {selectedFiles.length} Resume{selectedFiles.length !== 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
}

