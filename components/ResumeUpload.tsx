'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, User } from 'lucide-react';

interface ResumeUploadProps {
  onUpload: (file: File, name: string) => void;
  disabled?: boolean;
}

export default function ResumeUpload({ onUpload, disabled }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [personName, setPersonName] = useState('');
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
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
    if (selectedFile) {
      onUpload(selectedFile, personName || 'Unknown');
      setSelectedFile(null);
      setPersonName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Person Name Input */}
      <div className="space-y-2">
        <label htmlFor="person-name" className="block text-sm font-medium text-gray-700">
          Team Member Name (Optional)
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="person-name"
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Enter team member name"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={disabled}
          />
        </div>
      </div>

      {/* File Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        {selectedFile ? (
          <div className="space-y-2">
            <FileText className="mx-auto h-12 w-12 text-primary-500" />
            <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="mt-2 text-red-500 hover:text-red-700 text-sm inline-flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop your resume here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports PDF, DOC, DOCX, and TXT files
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      {selectedFile && (
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Analyze Resume
        </button>
      )}
    </div>
  );
}

