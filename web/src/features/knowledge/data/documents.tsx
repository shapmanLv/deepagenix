import { nanoid } from 'nanoid'
import { DocumentItem } from '../data/schema'

export const documents: DocumentItem[] = [
  {
    id: nanoid(),
    name: '1',
    wordCount: 1,
    tokens: 123,
    doc_metadata: '',
    mode: '',
  },
]
