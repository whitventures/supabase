import { ListMinus, Loader2, PlayCircle, PlusCircle } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { Button, Input } from 'ui'
import { UseRealtimeLogsPreviewParams } from './useRealtimeLogsPreviewer'

interface HeaderProps {
  config: UseRealtimeLogsPreviewParams
  onSetConfig: Dispatch<SetStateAction<UseRealtimeLogsPreviewParams>>
}

export const Header = ({ config, onSetConfig }: HeaderProps) => {
  return (
    <div className="flex flex-row h-14 gap-2.5 items-center px-4">
      <div className="flex flex-row">
        <Button
          className="rounded-r-none border-r-0"
          type="default"
          size="tiny"
          icon={<ListMinus size="16" />}
        >
          <span>Choose Channel</span>
        </Button>
        <Button
          className="rounded-l-none border-l-0"
          type={config.enabled ? 'primary' : 'default'}
          size="tiny"
          iconRight={
            config.enabled ? (
              <Loader2 size="16" className="animate-spin" />
            ) : (
              <PlayCircle size="16" />
            )
          }
          onClick={() => onSetConfig({ ...config, enabled: !config.enabled })}
        >
          <span>Start listening</span>
        </Button>
      </div>
      <Input size="tiny" placeholder="Search for content" />
      <Button icon={<PlusCircle size="16" />} type="dashed" className="rounded-[28px]" size="tiny">
        <span>Add filter</span>
      </Button>
    </div>
  )
}
