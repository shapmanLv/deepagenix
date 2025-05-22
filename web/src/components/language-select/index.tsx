import { useGetLanguages } from '@/services/konwledge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LanguageSelectProps {
  value?: string
  onChange?: (value: string) => void
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  const { languages, isLoading } = useGetLanguages()

  return (
    <div className='relative'>
      <Select value={value} onValueChange={onChange}>
        <>
          <SelectTrigger className='w-[180px]' loading={isLoading}>
            <SelectValue placeholder='请选择语言' />
          </SelectTrigger>

          <SelectContent>
            {languages?.map((language) => (
              <SelectItem key={language.value} value={language.value}>
                {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </>
      </Select>
    </div>
  )
}
