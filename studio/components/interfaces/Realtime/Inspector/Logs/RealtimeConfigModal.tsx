import { partition } from 'lodash'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { FormActions, FormPanel, FormSectionContent } from 'components/ui/Forms'
import { useSchemasQuery } from 'data/database/schemas-query'
import { useSelectedProject, useStore } from 'hooks'
import { EXCLUDED_SCHEMAS } from 'lib/constants/schemas'
import { Form, Input, Modal } from 'ui'
import { UseRealtimeLogsPreviewParams } from './useRealtimeLogsPreviewer'

const RealtimeConfigModal = ({
  visible,
  onClose,
  connectionConfig,
  setConnectionConfig,
}: {
  visible: boolean
  onClose: () => void
  connectionConfig: UseRealtimeLogsPreviewParams
  setConnectionConfig: Dispatch<SetStateAction<UseRealtimeLogsPreviewParams>>
}) => {
  const { meta } = useStore()
  const project = useSelectedProject()

  const { data: schemas } = useSchemasQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
  })
  const [selectedSchema, setSelectedSchema] = useState('public')

  const [protectedSchemas, openSchemas] = partition(schemas ?? [], (schema) =>
    EXCLUDED_SCHEMAS.includes(schema?.name ?? '')
  )

  const onSubmit = (values: any) => {
    const obj = {
      enabled: connectionConfig.enabled,
      channelName: values.CHANNEL,
      projectRef: values.PROJECT_REF,
      logLevel: values.LOG_LEVEL,
      token: values.TOKEN,
      schema: selectedSchema,
      table: values.TABLE,
      tableId: connectionConfig.tableId,
      filter: values.FILTER,
      bearer: values.BEARER,
      enablePresence: values.ENABLE_PRESENCE,
      enableDbChanges: values.ENABLE_DB_CHANGES,
      enableBroadcast: values.ENABLE_BROADCAST,
    }
    setConnectionConfig(obj)

    onClose()
  }

  return (
    <Modal
      layout="vertical"
      visible={visible}
      header="Edit realtime connection"
      onCancel={() => onClose()}
      // customFooter={<></>}
      hideFooter
      size="large"
    >
      <Form id={'realtime-connection-config'} initialValues={{}} onSubmit={onSubmit}>
        {({ resetForm }: any) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            resetForm({
              values: {
                ENABLE_BROADCAST: connectionConfig.enableBroadcast,
                ENABLE_PRESENCE: connectionConfig.enablePresence,
                ENABLE_DB_CHANGES: connectionConfig.enableDbChanges,
                PROJECT_REF: connectionConfig.projectRef,
                // PROJECT_HOST: connectionConfig.enableDbChanges,
                CHANNEL: connectionConfig.channelName,
                TABLE: connectionConfig.table,
                FILTER: connectionConfig.filter,
                TOKEN: connectionConfig.token,
                BEARER: connectionConfig.bearer,
                LOG_LEVEL: connectionConfig.logLevel,
              },
            })
            setSelectedSchema(connectionConfig.schema)
          }, [JSON.stringify(connectionConfig), visible])
          return (
            <>
              <FormPanel
                footer={
                  <div className="flex py-4 px-8">
                    <FormActions
                      form={'realtime-connection-config'}
                      hasChanges={true}
                      handleReset={() => onClose()}
                    />
                  </div>
                }
              >
                <div className="p-8">
                  <FormSectionContent loading={false}>
                    <Input
                      name="PROJECT_REF"
                      id="PROJECT_REF"
                      label="Project Reference ID"
                      descriptionText="Supabase platform project `Reference ID` or... (will be removed)"
                      placeholder="abcdefghijklmnoprstq"
                    />
                    {/* <Input
                      name="PROJECT_HOST"
                      id="PROJECT_HOST"
                      label="Host"
                      descriptionText="The host to connect to (will be removed)"
                      placeholder="https://abcdefghijklmnoprstq.supabase.co"
                    /> */}
                    <Input
                      name="CHANNEL"
                      id="CHANNEL"
                      label="Channel"
                      descriptionText="The Channel to connect to"
                      placeholder="room_a"
                    />
                  </FormSectionContent>

                  <FormSectionContent loading={false}>
                    {/* <FormLayout descriptionText="Listen to changes from tables in this schema">
                      <Listbox size="small" value={selectedSchema} onChange={setSelectedSchema}>
                        <Listbox.Option
                          disabled
                          key="normal-schemas"
                          value="normal-schemas"
                          label="Schemas"
                        >
                          <p className="text-sm">Schemas</p>
                        </Listbox.Option>
                        {openSchemas.map((schema) => (
                          <Listbox.Option
                            key={schema.id}
                            value={schema.name}
                            label={schema.name}
                            addOnBefore={() => <span className="text-scale-900">schema</span>}
                          >
                            <span className="text-scale-1200 text-sm">{schema.name}</span>
                          </Listbox.Option>
                        ))}
                        <Listbox.Option
                          disabled
                          key="protected-schemas"
                          value="protected-schemas"
                          label="Protected schemas"
                        >
                          <p className="text-sm">Protected schemas</p>
                        </Listbox.Option>
                        {protectedSchemas.map((schema) => (
                          <Listbox.Option
                            key={schema.id}
                            value={schema.name}
                            label={schema.name}
                            addOnBefore={() => <span className="text-scale-900">schema</span>}
                          >
                            <span className="text-scale-1200 text-sm">{schema.name}</span>
                          </Listbox.Option>
                        ))}
                      </Listbox>
                    </FormLayout> */}
                    <Input
                      name="TABLE"
                      id="TABLE"
                      label="Table"
                      descriptionText="Listen to changes from this table (will be listbox)"
                      placeholder="*"
                    />
                    <Input
                      name="FILTER"
                      id="FILTER"
                      label="Filter"
                      descriptionText="Match records with a filter"
                      placeholder="body=eq.hey"
                    />
                  </FormSectionContent>

                  <FormSectionContent loading={false}>
                    <Input
                      name="TOKEN"
                      id="TOKEN"
                      label="Token"
                      descriptionText="Your Supabase `anon` or `service_role` key"
                    />
                    <Input
                      name="BEARER"
                      id="BEARER"
                      label="Bearer"
                      descriptionText="An Auth user JWT optionally signed with custom claims "
                    />
                  </FormSectionContent>
                  <FormSectionContent loading={false}>
                    <Input name="LOG_LEVEL" id="LOG_LEVEL" label="Log level" descriptionText="" />
                  </FormSectionContent>
                </div>
              </FormPanel>
            </>
          )
        }}
      </Form>
    </Modal>
  )
}

export default RealtimeConfigModal
