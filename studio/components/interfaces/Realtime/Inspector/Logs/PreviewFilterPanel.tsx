import { Label } from '@ui/components/shadcn/ui/label'
import { FormActions } from 'components/ui/Forms'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  Button,
  Form,
  Input,
  PopoverContent_Shadcn_,
  PopoverTrigger_Shadcn_,
  Popover_Shadcn_,
  Switch,
} from 'ui'
import { Filter } from './filter/Filter'
import RealtimeConfigModal from './RealtimeConfigModal'
import { SchemasListbox } from './SchemasListbox'
import { TablesListbox } from './TablesListbox'
import { UseRealtimeLogsPreviewParams } from './useRealtimeLogsPreviewer'

interface PreviewFilterPanelProps {
  condensedLayout: Boolean
  config: UseRealtimeLogsPreviewParams
  onSetConfig: Dispatch<SetStateAction<UseRealtimeLogsPreviewParams>>
  sendEvent: (event: any, payload: any) => void
}

/**
 * Logs control panel header + wrapper
 */
const PreviewFilterPanel = ({
  condensedLayout,
  config,
  onSetConfig,
  sendEvent,
}: PreviewFilterPanelProps) => {
  const [isModalShown, setModalShown] = useState(false)
  console.log(config.tableId)
  return (
    <div
      className={'flex w-full items-center justify-between' + (condensedLayout ? ' px-5 pt-4' : '')}
    >
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row gap-4 items-center">
          <Switch
            id="realtime-enabled"
            checked={config.enabled}
            onCheckedChange={() => onSetConfig({ ...config, enabled: !config.enabled })}
          />
          <Label htmlFor="realtime-enabled">Realtime</Label>
          {config.enabled && (
            <>
              {/* <Switch
                id="broadcast_enabled"
                disabled={!config.enabled}
                checked={config.enableBroadcast}
                onCheckedChange={() =>
                  onSetConfig({ ...config, enableBroadcast: !config.enableBroadcast })
                }
              />
              <Label htmlFor="broadcast_enabled">Enable broadcast</Label>*/}
              <Switch
                id="presence_enabled"
                disabled={!config.enabled}
                checked={config.enablePresence}
                onCheckedChange={() =>
                  onSetConfig({ ...config, enablePresence: !config.enablePresence })
                }
              />
              <Label htmlFor="presence_enabled">Enable presence</Label>
              <Switch
                id="db_changes_enabled"
                disabled={!config.enabled}
                checked={config.enableDbChanges}
                onCheckedChange={() =>
                  onSetConfig({ ...config, enableDbChanges: !config.enableDbChanges })
                }
              />
              <Label htmlFor="db_changes_enabled">Enable database changes</Label>
              {config.enableDbChanges && (
                <>
                  <SchemasListbox
                    value={config.schema}
                    onChange={(v) => onSetConfig({ ...config, schema: v })}
                    isLocked={false}
                  />
                  <TablesListbox
                    selectedSchemaName={config.schema}
                    value={config.table}
                    onChange={(t, id) => onSetConfig({ ...config, table: t, tableId: id })}
                    isLocked={false}
                  />
                </>
              )}
            </>
          )}
          <Button onClick={() => setModalShown(true)}>Set config</Button>
        </div>
        <SendEventPopover sendEvent={sendEvent} />
        {config.tableId && <Filter tableId={config.tableId} />}
      </div>
      <RealtimeConfigModal
        visible={isModalShown}
        onClose={() => setModalShown(false)}
        connectionConfig={config}
        setConnectionConfig={onSetConfig}
      />
    </div>
  )
}

const SendEventPopover = ({ sendEvent }: { sendEvent: (event: any, payload: any) => void }) => {
  const [open, setOpen] = useState(false)

  const initialValues = { EVENT_NAME: '', EVENT_PAYLOAD: '' }
  const onSubmit = (values: any) => {
    sendEvent(values.EVENT_NAME, values.EVENT_PAYLOAD)
  }

  return (
    <Popover_Shadcn_ open={open} onOpenChange={setOpen}>
      <PopoverTrigger_Shadcn_>
        <Button>Send an event</Button>
      </PopoverTrigger_Shadcn_>
      <PopoverContent_Shadcn_>
        <Form
          id="submit-realtime-event"
          onSubmit={onSubmit}
          initialValues={initialValues}
          className="flex flex-col gap-2"
        >
          {({ resetForm }: any) => {
            return (
              <>
                <Input
                  name="EVENT_NAME"
                  id="EVENT_NAME"
                  label="Event"
                  size="tiny"
                  descriptionText="Event name"
                  placeholder="test"
                />
                <Input
                  name="EVENT_PAYLOAD"
                  id="EVENT_PAYLOAD"
                  label="Payload"
                  size="tiny"
                  descriptionText="Message payload (in JSON)"
                  placeholder={`{"some":"data"}`}
                />
                <div className="pt-4">
                  <FormActions
                    handleReset={() => {
                      resetForm({
                        values: { EVENT_NAME: '', EVENT_PAYLOAD: '' },
                      })
                    }}
                    form="submit-realtime-event"
                    hasChanges={true}
                    submitText="Send"
                  />
                </div>
              </>
            )
          }}
        </Form>
      </PopoverContent_Shadcn_>
    </Popover_Shadcn_>
  )
}

export default PreviewFilterPanel
