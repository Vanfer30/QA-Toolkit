import React, { useState, useRef, DragEvent } from 'react'

type FileUploadProps = {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  onUpload?: (files: File[]) => void
  onError?: (error: string) => void
}

type FileWithPreview = {
  file: File
  preview?: string
  id: string
}

export default function FileUpload({
  accept = '*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  onUpload,
  onError
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`
    }
    
    if (accept !== '*' && !file.type.match(accept.replace('*', '.*'))) {
      return `File ${file.name} is not an accepted file type`
    }
    
    return null
  }

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        resolve(undefined)
      }
    })
  }

  const processFiles = async (fileList: FileList) => {
    const newFiles: FileWithPreview[] = []
    const errors: string[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const error = validateFile(file)
      
      if (error) {
        errors.push(error)
        onError?.(error)
      } else {
        const preview = await createFilePreview(file)
        newFiles.push({
          file,
          preview,
          id: `${file.name}-${Date.now()}-${i}`
        })
      }
    }

    if (errors.length === 0) {
      setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      processFiles(fileList)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const fileList = e.dataTransfer.files
    if (fileList) {
      processFiles(fileList)
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    try {
      onUpload?.(files.map(f => f.file))
      setFiles([])
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div data-cy="file-upload">
      {/* Drop Zone */}
      <div
        data-cy="drop-zone"
        ref={fileInputRef}
        style={{
          border: `2px dashed ${isDragOver ? '#007bff' : '#ccc'}`,
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: isDragOver ? '#f8f9fa' : 'white',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          data-cy="file-input"
        />
        <div data-cy="upload-text">
          <p>Drag and drop files here, or click to select files</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Accepted types: {accept} | Max size: {formatFileSize(maxSize)}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div data-cy="file-list" style={{ marginTop: '20px' }}>
          <h3>Selected Files ({files.length})</h3>
          {files.map((fileWithPreview) => (
            <div
              key={fileWithPreview.id}
              data-cy="file-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '10px'
              }}
            >
              {fileWithPreview.preview && (
                <img
                  data-cy="file-preview"
                  src={fileWithPreview.preview}
                  alt={fileWithPreview.file.name}
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    marginRight: '10px',
                    borderRadius: '4px'
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div data-cy="file-name">{fileWithPreview.file.name}</div>
                <div data-cy="file-size" style={{ fontSize: '12px', color: '#666' }}>
                  {formatFileSize(fileWithPreview.file.size)}
                </div>
              </div>
              <button
                data-cy="remove-file"
                onClick={() => removeFile(fileWithPreview.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>
          ))}
          
          <button
            data-cy="upload-button"
            onClick={handleUpload}
            disabled={uploading}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      )}
    </div>
  )
}
