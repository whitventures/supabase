import { UseQueryOptions } from '@tanstack/react-query'
import { ExecuteSqlData, useExecuteSqlQuery } from '../sql/execute-sql-query'

export const getDatabaseLargestObjectsQuery = () => {
  const sql = /* SQL */ `
SELECT 
  SCHEMA_NAME,
  relname,
  table_size
FROM
  (SELECT 
    pg_catalog.pg_namespace.nspname AS SCHEMA_NAME,
    relname,
    pg_relation_size(pg_catalog.pg_class.oid) AS table_size
  FROM pg_catalog.pg_class
  JOIN pg_catalog.pg_namespace ON relnamespace = pg_catalog.pg_namespace.oid
  ) t
WHERE SCHEMA_NAME NOT LIKE 'pg_%'
ORDER BY table_size DESC
LIMIT 10;
`.trim()

  return sql
}

export type DatabaseLargestObjectsVariables = {
  projectRef?: string
  connectionString?: string
}

export type DatabaseLargestObjectsData = { result: { schema_name: string, relname: string, table_size: number }[] }
export type DatabaseLargestObjectsError = unknown

export const useDatabaseLargestObjectsQuery = <TData extends DatabaseLargestObjectsData = DatabaseLargestObjectsData>(
  { projectRef, connectionString }: DatabaseLargestObjectsVariables,
  options: UseQueryOptions<ExecuteSqlData, DatabaseLargestObjectsError, TData> = {}
) => {
  return useExecuteSqlQuery(
    {
      projectRef,
      connectionString,
      sql: getDatabaseLargestObjectsQuery(),
      queryKey: ['database-largest-objects'],
    },
    {
      ...options,
      staleTime: 1000 * 60, // default good for a minute
    }
  )
}
