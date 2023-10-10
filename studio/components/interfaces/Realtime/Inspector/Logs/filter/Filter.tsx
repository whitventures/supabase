import { useParams } from 'common'
import FilterPopover from 'components/grid/components/header/filter'
import { parseSupaTable } from 'components/grid/SupabaseGrid.utils'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import { useTableQuery } from 'data/tables/table-query'

export const Filter = ({ tableId }: { tableId: number }) => {
  const { project } = useProjectContext()
  const { ref: projectRef } = useParams()

  const { data: table } = useTableQuery({
    id: tableId,
    projectRef,
    connectionString: project?.connectionString,
  })

  if (!table) {
    return null
  }
  const supaTable = parseSupaTable(
    {
      table: table,
      columns: table.columns ?? [],
      primaryKeys: table.primary_keys,
      relationships: table.relationships,
    },
    []
  )

  return <FilterPopover table={supaTable} filters={[]} setParams={() => {}} />
}
