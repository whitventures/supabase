import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import { useSchemasQuery } from 'data/database/schemas-query'
import { EXCLUDED_SCHEMAS } from 'lib/constants/schemas'
import { partition } from 'lodash'
import { IconLock, Listbox } from 'ui'

interface SchemasListBoxProps {
  value: string
  onChange: (value: string) => void
  isLocked: boolean
}

export const SchemasListbox = ({ value, onChange, isLocked }: SchemasListBoxProps) => {
  const { project } = useProjectContext()

  const { data: schemas } = useSchemasQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
  })
  const [protectedSchemas, openSchemas] = partition(schemas ?? [], (schema) =>
    EXCLUDED_SCHEMAS.includes(schema?.name ?? '')
  )

  return (
    <div className="w-[260px]">
      <Listbox
        size="small"
        value={value}
        onChange={onChange}
        icon={isLocked && <IconLock size={14} strokeWidth={2} />}
      >
        <Listbox.Option disabled key="normal-schemas" value="normal-schemas" label="Schemas">
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
    </div>
  )
}
