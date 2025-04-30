'use client'

import { useState, useCallback, useEffect } from 'react'
import { IconX, IconUpload } from '@tabler/icons-react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { useSupportedFileTypes } from '@/hooks/use-upported-file-types'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type FileWithPreview = File & {
  preview: string
  uploadProgress?: number
  size: number
  type: Blob['type']
  lastModified: number
  name: string
}

export function FileUpload() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { fileAccept, getFileIcon } = useSupportedFileTypes()

  // Simulate upload (returns Promise)
  const simulateUpload = (file: FileWithPreview) => {
    return new Promise<void>((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5
        const newProgress = Math.min(progress, 100)

        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, uploadProgress: newProgress } : f
          )
        )

        if (newProgress >= 100) {
          clearInterval(interval)
          resolve()
        }
      }, 300)
    })
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)

    const mappedFiles = acceptedFiles.map((file) => {
      // 提取文件扩展名
      return {
        ...file,
        preview: URL.createObjectURL(file),
        uploadProgress: 0,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        name: file.name,
      }
    })
    setFiles((prev) => [...prev, ...mappedFiles])

    try {
      await Promise.all(mappedFiles.map((file) => simulateUpload(file)))
    } finally {
      setIsUploading(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileAccept,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName))
  }

  return (
    <Card className='w-full max-w-3xl'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>Upload Files</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={cn(
            'group rounded-xl border-2 border-dashed p-8 text-center transition-colors',
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/50 hover:border-primary/30',
            isUploading && 'cursor-not-allowed opacity-50'
          )}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center gap-4'>
            <IconUpload
              className={cn(
                'text-muted-foreground h-10 w-10 transition-colors',
                isDragActive && 'text-primary'
              )}
            />
            <div className='space-y-1'>
              <p className='text-sm font-medium'>
                {isDragActive
                  ? 'Drop to upload'
                  : 'Drag & drop or click to select'}
              </p>
              <p className='text-muted-foreground text-xs'>
                Supported formats:{' '}
                {useSupportedFileTypes()
                  .fileTypes.map((t) => t.extensions)
                  .flat()
                  .join(', ')}{' '}
                (Max 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className='no-scrollbar mt-6 max-h-[400px] space-y-4 overflow-auto'>
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type)
              return (
                <div
                  key={file.name}
                  className='bg-muted/50 flex items-center justify-between rounded-lg border p-4'
                >
                  <div className='flex min-w-0 flex-1 items-center gap-3'>
                    <div className='text-muted-foreground'>
                      <FileIcon className='h-6 w-6' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='truncate font-medium'>
                          {file.name}
                        </span>
                        <span className='text-muted-foreground ml-2 text-xs'>
                          {(file?.size / 1024)?.toFixed(1)}KB
                        </span>
                      </div>
                      {file.uploadProgress !== undefined && (
                        <div className='mt-1.5'>
                          <Progress
                            value={file.uploadProgress}
                            className='bg-muted h-2'
                          />
                          <div className='text-muted-foreground mt-1 flex justify-between text-xs'>
                            <span>
                              {file.uploadProgress === 100
                                ? 'Upload complete'
                                : 'Uploading...'}
                            </span>
                            <span>{file.uploadProgress}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-muted-foreground hover:text-destructive ml-2 h-8 w-8'
                    onClick={() => removeFile(file.name)}
                    disabled={isUploading}
                  >
                    <IconX className='h-4 w-4' />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
