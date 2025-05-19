import {
  IconFile,
  IconFileTypePdf,
  IconFileTypeDocx,
  IconFileTypePpt,
  IconFileTypeXls,
  IconFileTypeTxt,
  IconMarkdown,
} from '@tabler/icons-react'

export const useSupportedFileTypes = () => {
  const fileTypes = [
    {
      name: 'PDF',
      mimeType: 'application/pdf',
      extensions: ['.pdf'],
      icon: IconFileTypePdf,
    },
    {
      name: 'Word',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extensions: ['.docx'],
      icon: IconFileTypeDocx,
    },
    {
      name: 'PowerPoint',
      mimeType:
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      extensions: ['.pptx'],
      icon: IconFileTypePpt,
    },
    {
      name: 'Excel',
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extensions: ['.xlsx'],
      icon: IconFileTypeXls,
    },
    {
      name: 'Text',
      mimeType: 'text/plain',
      extensions: ['.txt'],
      icon: IconFileTypeTxt,
    },
    {
      name: 'Markdown',
      mimeType: 'text/markdown',
      extensions: ['.md'],
      icon: IconMarkdown,
    },
  ]

  const defaultIcon = IconFile

  const fileAccept = fileTypes.reduce(
    (acc, type) => {
      acc[type.mimeType] = type.extensions
      return acc
    },
    {} as Record<string, string[]>
  )

  const getFileIcon = (mimeType: string) => {
    const foundType = fileTypes.find((type) => type.mimeType === mimeType)
    return foundType ? foundType.icon : defaultIcon
  }

  return {
    fileTypes,
    fileAccept,
    getFileIcon,
    defaultIcon,
  }
}
