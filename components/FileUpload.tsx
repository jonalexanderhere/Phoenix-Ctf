'use client'

import { useState, useRef } from 'react'

interface FileUploadProps {
  // eslint-disable-next-line no-unused-vars
  onFileUpload: (file: File) => void
  isUploading: boolean
  uploadedFile: { fileName: string; url: string } | null
  category: string
}

export default function FileUpload({ onFileUpload, isUploading, uploadedFile, category }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0])
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  const getAcceptedTypes = () => {
    switch (category) {
      case 'REVERSE':
        return '.exe,.bin,.elf,.so,.dll'
      case 'PWN':
        return '.exe,.bin,.elf,.so,.dll'
      case 'FORENSICS':
        return '.zip,.tar,.gz,.7z,.pcap,.img,.iso'
      case 'CRYPTO':
        return '.txt,.py,.js,.zip,.tar,.gz'
      case 'MISC':
        return '.txt,.pdf,.zip,.tar,.gz,.7z'
      default:
        return '*'
    }
  }

  const getMaxSize = () => {
    return 10 * 1024 * 1024 // 10MB
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        📁 Upload Challenge File
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-primary-400 transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={getAcceptedTypes()}
          disabled={isUploading}
        />
        
        <div className="space-y-2">
          <div className="text-gray-400">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            ) : (
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            {isUploading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Click to upload
                </button>
                <span> or drag and drop</span>
              </>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            {getAcceptedTypes() === '*' 
              ? 'Any file type' 
              : `Accepted: ${getAcceptedTypes()}`
            } (max {Math.round(getMaxSize() / 1024 / 1024)}MB)
          </p>
        </div>
      </div>

      {uploadedFile && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-green-800">
              File uploaded: {uploadedFile.fileName}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
