import { IconMoodEmpty } from '@tabler/icons-react'
import { PluginsItem, useGetPlugins } from '@/services/konwledge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type PluginSelectorProps = {
  value?: string
  onChange?: (value: string) => void
  previewFilter?: (plugins: PluginsItem) => boolean
}

export function PluginSelector({
  value,
  onChange,
  previewFilter,
}: PluginSelectorProps) {
  const { plugins, isLoading } = useGetPlugins()

  const filteredByPreview =
    previewFilter && plugins ? plugins.filter(previewFilter) : plugins

  const displayPlugins = filteredByPreview?.length ? filteredByPreview : plugins

  return (
    <div className='relative'>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger loading={isLoading} className='w-full'>
          <SelectValue placeholder='请选择分词插件' />
        </SelectTrigger>
        <SelectContent>
          {displayPlugins && displayPlugins.length > 0 ? (
            displayPlugins.map((plugin) => (
              <TooltipProvider key={plugin.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectItem value={plugin.value} className='relative py-2'>
                      <div className='flex gap-2'>
                        <div className='flex items-center gap-2'>
                          <img
                            src={plugin.icon}
                            alt='icon'
                            className='h-5 w-5 object-contain'
                          />
                          <div className='max-w-[300px] truncate text-sm font-medium'>
                            {plugin.name}
                          </div>
                        </div>
                        <div className='flex flex-wrap gap-1'>
                          {plugin.languages.map((lang) => (
                            <span
                              key={lang}
                              className='rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-700'
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </SelectItem>
                  </TooltipTrigger>

                  <TooltipContent
                    side='right'
                    align='start'
                    sideOffset={16}
                    className='bg-popover w-64 rounded-lg border p-4 shadow-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <img
                        src={plugin.icon}
                        alt='icon'
                        className='h-10 w-10 object-contain p-2 shadow-sm'
                      />
                      <div>
                        <h4 className='text-primary font-medium'>
                          {plugin.name}
                        </h4>
                        <p className='text-muted-foreground text-xs'>
                          分词插件
                        </p>
                      </div>
                    </div>
                    <p className='text-foreground mt-3 line-clamp-6 text-sm'>
                      {plugin.description}
                    </p>
                    <div className='mt-3 text-xs'>
                      <div>
                        <span className='text-muted-foreground'>支持语言:</span>
                        <span className='text-primary ml-1'>
                          {plugin.languages.join(', ')}
                        </span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          ) : (
            <div className='text-muted-foreground flex flex-col items-center justify-center py-4'>
              <IconMoodEmpty className='mb-2 h-6 w-6' />
              <span className='text-sm'>暂无数据</span>
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
