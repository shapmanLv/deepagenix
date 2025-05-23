import { IconMoodEmpty } from '@tabler/icons-react'
import { useGetLanguages } from '@/services/konwledge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 空状态图标

interface LanguageSelectProps {
  value?: string
  onChange?: (value: string) => void
}

export function LanguageSelector({ value, onChange }: LanguageSelectProps) {
  const { languages, isLoading } = useGetLanguages()

  return (
    <div className='relative'>
      <Select value={value} onValueChange={onChange}>
        <>
          <SelectTrigger loading={isLoading} className='w-[240px]'>
            <SelectValue placeholder='请选择语言' />
          </SelectTrigger>

          <SelectContent>
            {languages && languages.length > 0 ? (
              languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.name}
                </SelectItem>
              ))
            ) : (
              <div className='text-muted-foreground flex flex-col items-center justify-center py-4'>
                <IconMoodEmpty className='mb-2 h-6 w-6' />
                <span className='text-sm'>暂无数据</span>
              </div>
            )}
          </SelectContent>
        </>
      </Select>
    </div>
  )
}
