import { DocumentItem } from '@/services/konwledge/schema'
import { nanoid } from 'nanoid'

const mockModes = ['edit', 'view', 'review', 'archive']
const mockMetadata = ['draft', 'final', 'confidential', 'public']

export const generateMockDocuments = (count: number = 30): DocumentItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: nanoid(),
    name: `Document ${i + 1}`,
    wordCount: Math.floor(Math.random() * 5000) + 100, // Random between 100-5100
    tokens: Math.floor(Math.random() * 10000) + 500, // Random between 500-10500
    doc_metadata: mockMetadata[Math.floor(Math.random() * mockMetadata.length)],
    mode: mockModes[Math.floor(Math.random() * mockModes.length)],
  }))
}

export const documents: DocumentItem[] = generateMockDocuments()
