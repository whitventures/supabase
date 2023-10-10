import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { FormLayout } from '@ui/lib/Layout/FormLayout'
import RealtimeLayout from 'components/layouts/RealtimeLayout/RealtimeLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import {
  FormHeader,
  FormPanel,
  FormSection,
  FormSectionContent,
  FormSectionLabel,
} from 'components/ui/Forms'
import { useSchemasQuery } from 'data/database/schemas-query'
import { useSelectedProject, useStore } from 'hooks'
import { EXCLUDED_SCHEMAS } from 'lib/constants/schemas'
import { partition } from 'lodash'
import { NextPageWithLayout } from 'types'
import { Form, Input, Listbox, Toggle } from 'ui'

// copy-pasted from database/replication.tsx. This should be the new place for this page since it's
// only related to realtime replication.
const Inspector: NextPageWithLayout = () => {
  const { meta } = useStore()
  const project = useSelectedProject()

  const { data: schemas, isLoading: isSchemasLoading } = useSchemasQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
  })
  const [selectedSchema, setSelectedSchema] = useState('public')

  const [protectedSchemas, openSchemas] = partition(schemas ?? [], (schema) =>
    EXCLUDED_SCHEMAS.includes(schema?.name ?? '')
  )

  return (
    <ScaffoldContainer className="py-8">
      <ScaffoldSection>
        <Form id={'some'} initialValues={{}} onSubmit={() => {}} className="col-span-12">
          {() => {
            return (
              <>
                <FormHeader
                  title="Realtime inspector"
                  description="You can use your this inspector to debug your realtime issues"
                />
                <FormPanel>
                  <FormSection>
                    <FormSectionContent loading={false} fullWidth>
                      <Toggle
                        name="ENABLE_BROADCAST"
                        size="small"
                        label="Enable broadcast"
                        layout="flex"
                        descriptionText="Broadcast is always enabled when successfully connected to a Channel"
                      />
                      <Toggle
                        name="ENABLE_PRESENCE"
                        size="small"
                        label="Enable presence"
                        layout="flex"
                        descriptionText="Enable Presence on this Channel"
                      />
                      <Toggle
                        name="ENABLE_DB_CHANGES"
                        size="small"
                        label="Enable database changes"
                        layout="flex"
                        descriptionText="Enable Database Changes on this Channel"
                      />
                    </FormSectionContent>
                  </FormSection>

                  <FormSection header={<FormSectionLabel>Project details</FormSectionLabel>}>
                    <FormSectionContent loading={false}>
                      <Input
                        name="PROJECT_REF"
                        id="PROJECT_REF"
                        label="Project Reference ID"
                        descriptionText="Supabase platform project `Reference ID` or..."
                        placeholder="abcdefghijklmnoprstq"
                      />
                      <Input
                        name="PROJECT_HOST"
                        id="PROJECT_HOST"
                        label="Host"
                        descriptionText="The host to connect to"
                        placeholder="https://abcdefghijklmnoprstq.supabase.co"
                      />
                      <Input
                        name="CHANNEL"
                        id="CHANNEL"
                        label="Channel"
                        descriptionText="The Channel to connect to"
                        placeholder="room_a"
                      />
                    </FormSectionContent>
                  </FormSection>

                  <FormSection header={<FormSectionLabel>Database details</FormSectionLabel>}>
                    <FormSectionContent loading={false}>
                      <FormLayout descriptionText="Listen to changes from tables in this schema">
                        <Listbox size="small" value={selectedSchema} onChange={setSelectedSchema}>
                          <Listbox.Option
                            disabled
                            key="normal-schemas"
                            value="normal-schemas"
                            label="Schemas"
                          >
                            <p className="text-sm">Schemas</p>
                          </Listbox.Option>
                          {/* @ts-ignore */}
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
                      </FormLayout>
                      <Input
                        name="TABLE"
                        id="TABLE"
                        label="Table"
                        descriptionText="Listen to changes from this table"
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
                  </FormSection>

                  <FormSection header={<FormSectionLabel>Authentication details</FormSectionLabel>}>
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
                  </FormSection>
                  <FormSection header={<FormSectionLabel>Miscellaneous</FormSectionLabel>}>
                    <FormSectionContent loading={false}>
                      <Input name="LOG_LEVEL" id="LOG_LEVEL" label="Log level" descriptionText="" />
                    </FormSectionContent>
                  </FormSection>
                </FormPanel>
              </>
            )
          }}
        </Form>
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

Inspector.getLayout = (page) => <RealtimeLayout title="Realtime">{page}</RealtimeLayout>

export default observer(Inspector)
