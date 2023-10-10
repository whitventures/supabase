import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import { ENTITY_TYPE } from 'data/entity-types/entity-type-constants'
import { useEntityTypesQuery } from 'data/entity-types/entity-types-infinite-query'
import { IconLock, Listbox } from 'ui'

interface SchemasListBoxProps {
  selectedSchemaName: string
  value: string
  onChange: (value: string, id: number | undefined) => void
  isLocked: boolean
}

export const TablesListbox = ({
  selectedSchemaName,
  value,
  onChange,
  isLocked,
}: SchemasListBoxProps) => {
  const { project } = useProjectContext()

  const { data, isLoading } = useEntityTypesQuery(
    {
      projectRef: project?.ref,
      connectionString: project?.connectionString,
      schema: selectedSchemaName,
    },
    {
      keepPreviousData: true,
    }
  )

  if (isLoading) {
    return <></>
  }

  const entities = data?.pages[0].data.entities ?? []

  const options = [
    {
      name: '*',
      id: 0,
      schema: 'selectedSchemaName',
      comment: null,
      type: ENTITY_TYPE.TABLE,
    },
    ...entities,
  ]

  return (
    <div className="w-[260px]">
      <Listbox
        size="small"
        value={value}
        onChange={(v) => onChange(v, entities.find((e) => e.name === v)?.id)}
        icon={isLocked && <IconLock size={14} strokeWidth={2} />}
      >
        {options.map((p) => {
          return (
            <Listbox.Option
              key={p.name}
              value={p.name}
              label={p.name}
              addOnBefore={() => <span className="text-scale-900">table</span>}
            >
              <span className="text-scale-1200 text-sm">{p.name}</span>
            </Listbox.Option>
          )
        })}
      </Listbox>
    </div>
  )
}
