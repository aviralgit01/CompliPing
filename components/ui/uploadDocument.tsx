'use client';
import React, { useState, ChangeEvent, useRef } from 'react';
import {
  Upload,
  X,
  FileText,
  Image,
  File,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface UploadDocumentProps {
  multiple?: boolean;
  allowedTypes: string[];
  maxSizeInMB?: number;
  onFilesChange?: (files: File[]) => void;
  uploadedFilePostition?: 'top' | 'bottom';
}

const UploadDocument: React.FC<UploadDocumentProps> = ({
  multiple = false,
  allowedTypes,
  maxSizeInMB = 5,
  onFilesChange,
  uploadedFilePostition = 'bottom',
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const maxSizeBytes = maxSizeInMB * 1024 * 1024;

  const validateFiles = (incomingFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    incomingFiles.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
      } else if (file.size > maxSizeBytes) {
        errors.push(`${file.name}: File size must be ${maxSizeInMB}MB or less`);
      } else {
        validFiles.push(file);
      }
    });

    return { validFiles, errors };
  };

  const handleFileInput = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;

    const selectedFiles = Array.from(incomingFiles);
    const { validFiles, errors } = validateFiles(selectedFiles);

    const updatedFiles = multiple
      ? [...files, ...validFiles]
      : validFiles.slice(0, 1);

    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    setError(errors.length > 0 ? errors.join('\n') : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileInput(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFileInput(e.dataTransfer.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className='w-4 h-4 text-blue-500' />;
    } else if (file.type === 'application/pdf') {
      return <FileText className='w-4 h-4 text-red-500' />;
    }
    return <File className='w-4 h-4 text-neutral-500' />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`space-y-6 flex ${uploadedFilePostition === 'top' ? 'flex-col-reverse gap-4' : 'flex-col'}`}
    >
      {/* Drop Area */}
      <div>
        <div
          onClick={handleClick}
          onDragOver={e => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${
            dragOver
              ? 'border-neutral-400 bg-neutral-50'
              : files.length > 0
                ? 'border-green-300 bg-green-50/30' //
                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-25'
          }
        `}
        >
          <div className='space-y-4'>
            {files.length > 0 ? (
              // --- VIEW WHEN FILE IS UPLOADED ---
              <>
                <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto'>
                  <FileText className='w-6 h-6 text-green-600' />
                </div>
                <div>
                  <h4 className='font-medium text-neutral-900 mb-1'>
                    File Uploaded
                  </h4>
                  <p className='text-sm text-neutral-600 font-medium truncate max-w-[250px] mx-auto'>
                    {files.length === 1
                      ? files[0].name
                      : `${files.length} files selected`}
                  </p>
                  <p className='text-xs text-neutral-400 mt-2'>
                    Click or drag to replace
                  </p>
                </div>
              </>
            ) : (
              // --- DEFAULT VIEW (NO FILE) ---
              <>
                <div className='w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto'>
                  <Upload className='w-6 h-6 text-neutral-600' />
                </div>

                <div>
                  <h4 className='font-medium text-neutral-900 mb-2'>
                    Drop files here or click to upload
                  </h4>
                  <p className='text-sm text-neutral-600'>
                    Supported formats:{' '}
                    {allowedTypes
                      .map(type => type.split('/')[1].toUpperCase())
                      .join(', ')}
                  </p>
                  <p className='text-xs text-neutral-500 mt-1'>
                    Maximum file size: {maxSizeInMB}MB each
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Inline Error */}
        {error && (
          <div className='flex items-start gap-2 text-sm text-red-600 mt-2'>
            <AlertCircle className='w-4 h-4 mt-0.5' />
            <span className='whitespace-pre-line'>{error}</span>
          </div>
        )}

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type='file'
          accept={allowedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileChange}
          className='hidden'
        />
      </div>

      {/* File List (Optional: You can keep or remove this if you only want the dropzone status) */}
      {/* If you want to HIDE the list below when showing status inside box, wrap this in !files.length > 0 check, 
          but usually keeping the list is good for removing specific files in multi-upload */}
      {files.length > 0 && (
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h4 className='font-medium text-neutral-900'>
              Uploaded Files ({files.length})
            </h4>
            <button
              onClick={e => {
                e.stopPropagation(); // Prevent triggering the file input
                setFiles([]);
                setError(null);
                onFilesChange?.([]);
              }}
              className='text-xs text-neutral-500 hover:text-neutral-700 transition-colors'
            >
              Clear all
            </button>
          </div>

          <div className='space-y-2'>
            {files.map((file, index) => (
              <div
                key={index}
                className='flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-25 transition-colors'
              >
                <div className='w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center flex-shrink-0'>
                  {getFileIcon(file)}
                </div>

                <div className='flex-1 min-w-0'>
                  <div
                    className='font-medium text-neutral-900 truncate'
                    title={file.name}
                  >
                    {file.name}
                  </div>
                  <div className='text-sm text-neutral-500'>
                    {formatFileSize(file.size)} •{' '}
                    {file.type.split('/')[1].toUpperCase()}
                  </div>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className='w-8 h-8 bg-neutral-100 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors group'
                  title='Remove file'
                >
                  <X className='w-4 h-4 text-neutral-500 group-hover:text-red-600' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocument;
