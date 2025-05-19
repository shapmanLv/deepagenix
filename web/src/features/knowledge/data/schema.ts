export enum IconType {
  IconFolders = 'IconFolders',
  IconFolderFilled = 'IconFolderFilled',
  IconDatabase = 'IconDatabase',
  IconBrandDatabricks = 'IconBrandDatabricks',
}

export interface KnowledgeItem {
  name: string
  icon: IconType
  documents: number
  relatedApplications: number
  desc: string
}
