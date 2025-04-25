'use client'

import { useState, useCallback, useEffect } from 'react'
import { X, UploadCloud, FileText, Image, File } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type FileWithPreview = File & {
  preview: string
  uploadProgress?: number
  size: number
}

export function FileUpload() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // 文件类型图标映射
  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) return <Image className='h-5 w-5' />
    if (fileType === 'application/pdf') return <FileText className='h-5 w-5' />
    return <File className='h-5 w-5' />
  }

  // 模拟上传（返回Promise）
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

    const mappedFiles = acceptedFiles.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
      uploadProgress: 0,
      size: file.size,
    }))

    setFiles((prev) => [...prev, ...mappedFiles])

    try {
      await Promise.all(mappedFiles.map((file) => simulateUpload(file)))
    } finally {
      setIsUploading(false)
    }
  }, [])

  useEffect(() => {
    // 清理预览URL
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName))
  }

  return (
    <Card className='w-full max-w-3xl'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>Upload file</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 拖拽区域 */}
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
            <UploadCloud
              className={cn(
                'text-muted-foreground h-10 w-10 transition-colors',
                isDragActive && 'text-primary'
              )}
            />
            <div className='space-y-1'>
              <p className='text-sm font-medium'>
                {isDragActive ? '释放以上传文件' : '拖放文件或点击选择'}
              </p>
              <p className='text-muted-foreground text-xs'>
                支持格式：PNG, JPG, PDF, TXT（最大5MB）
              </p>
            </div>
          </div>
        </div>

        {/* 文件列表 */}
        {files.length > 0 && (
          <div className='no-scrollbar mt-6 h-[400px] space-y-4 overflow-auto'>
            {files.map((file) => (
              <div
                key={file.name}
                className='bg-muted/50 flex items-center justify-between rounded-lg border p-4'
              >
                <div className='flex min-w-0 flex-1 items-center gap-3'>
                  <div className='text-muted-foreground'>
                    {getFileIcon(file.type)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='truncate font-medium'>{file.name}</span>
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
                              ? '上传完成'
                              : '上传中...'}
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
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
