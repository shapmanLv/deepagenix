import {
  IconBrandDatabricks,
  IconDatabase,
  IconFileUnknown,
  IconFolderFilled,
  IconFolders,
} from '@tabler/icons-react'
import { IconType } from '@/services/konwledge/schema'

export const renderCardIcon = (icon: IconType) => {
  if (icon === 'IconBrandDatabricks') {
    return <IconBrandDatabricks />
  }

  if (icon === 'IconDatabase') {
    return <IconDatabase />
  }

  if (icon === 'IconFolderFilled') {
    return <IconFolderFilled />
  }

  if (icon === 'IconFolders') {
    return <IconFolders />
  }

  return <IconFileUnknown />
}
