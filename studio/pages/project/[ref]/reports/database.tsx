import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'

import { TIME_PERIODS_INFRA } from 'lib/constants'
import { formatBytes } from 'lib/helpers'
import { NextPageWithLayout } from 'types'
import { AlertDescription_Shadcn_, Alert_Shadcn_, IconArrowRight } from 'ui'

import { ReportsLayout } from 'components/layouts'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import ChartHandler from 'components/to-be-cleaned/Charts/ChartHandler'
import DateRangePicker from 'components/to-be-cleaned/DateRangePicker'
import Panel from 'components/ui/Panel'
import { useDatabaseSizeQuery } from 'data/database/database-size-query'
import ReportWidget from 'components/interfaces/Reports/ReportWidget'
import { useParams } from 'common'
import { queriesFactory } from 'components/interfaces/Reports/Reports.utils'
import { PRESET_CONFIG } from 'components/interfaces/Reports/Reports.constants'
import { BaseReportParams } from 'components/interfaces/Reports/Reports.types'
import Table from 'components/to-be-cleaned/Table'

const DatabaseReport: NextPageWithLayout = () => {
  return (
    <div className="1xl:px-28 mx-auto flex flex-col gap-4 px-5 py-6 lg:px-16 xl:px-24 2xl:px-32">
      <div className="content h-full w-full overflow-y-auto">
        <div className="w-full">
          <DatabaseUsage />
        </div>
      </div>
    </div>
  )
}

DatabaseReport.getLayout = (page) => <ReportsLayout title="Database">{page}</ReportsLayout>

export default DatabaseReport

const DatabaseUsage = observer(() => {
  const { project } = useProjectContext()

  const [dateRange, setDateRange] = useState<any>(undefined)

  const { data } = useDatabaseSizeQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
  })
  const databaseSizeBytes = data?.result[0].db_size ?? 0

  const report = useDatabaseReport()

  return (
    <>
      <div>
        <section>
          <Panel title={<h2>Database health</h2>}>
            <Panel.Content>
              <div className="mb-4 flex items-center space-x-3">
                <DateRangePicker
                  loading={false}
                  value={'7d'}
                  options={TIME_PERIODS_INFRA}
                  currentBillingPeriodStart={undefined}
                  onChange={setDateRange}
                />
                {dateRange && (
                  <div className="flex items-center space-x-2">
                    <p className="text-foreground-light">
                      {dayjs(dateRange.period_start.date).format('MMMM D, hh:mma')}
                    </p>
                    <p className="text-foreground-light">
                      <IconArrowRight size={12} />
                    </p>
                    <p className="text-foreground-light">
                      {dayjs(dateRange.period_end.date).format('MMMM D, hh:mma')}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                {dateRange && (
                  <ChartHandler
                    startDate={dateRange?.period_start?.date}
                    endDate={dateRange?.period_end?.date}
                    attribute={'ram_usage'}
                    label={'Memory usage'}
                    interval={dateRange.interval}
                    provider={'infra-monitoring'}
                  />
                )}

                {dateRange && (
                  <ChartHandler
                    startDate={dateRange?.period_start?.date}
                    endDate={dateRange?.period_end?.date}
                    attribute={'swap_usage'}
                    label={'Swap usage'}
                    interval={dateRange.interval}
                    provider={'infra-monitoring'}
                  />
                )}

                {dateRange && (
                  <ChartHandler
                    startDate={dateRange?.period_start?.date}
                    endDate={dateRange?.period_end?.date}
                    attribute={'avg_cpu_usage'}
                    label={'Average CPU usage'}
                    interval={dateRange.interval}
                    provider={'infra-monitoring'}
                  />
                )}

                {dateRange && (
                  <ChartHandler
                    startDate={dateRange?.period_start?.date}
                    endDate={dateRange?.period_end?.date}
                    attribute={'max_cpu_usage'}
                    label={'Max CPU usage'}
                    interval={dateRange.interval}
                    provider={'infra-monitoring'}
                  />
                )}

                {dateRange && (
                  <ChartHandler
                    startDate={dateRange?.period_start?.date}
                    endDate={dateRange?.period_end?.date}
                    attribute={'disk_io_consumption'}
                    label={'Disk IO consumed'}
                    interval={dateRange.interval}
                    provider={'infra-monitoring'}
                  />
                )}
              </div>
            </Panel.Content>
          </Panel>

          <ReportWidget
            isLoading={report.isLoading}
            params={report.params.largestObjects}
            title="Database Size - Largest Objects"
            data={report.data.largestObjects || []}
            queryType={'db'}
            renderer={(props) => {
              return (
                <div>
                  <p className="text-sm">Database Size used</p>
                  <p className="text-xl tracking-wide">{formatBytes(databaseSizeBytes)}</p>

                  {!props.isLoading && props.data.length === 0 && (
                    <span>Could not find any large objects</span>
                  )}
                  {!props.isLoading && props.data.length > 0 && (
                    <Table
                      className="space-y-3 mt-4"
                      head={[
                        <Table.th key="object" className="py-2">
                          Object
                        </Table.th>,
                        <Table.th key="size" className="py-2">
                          Size
                        </Table.th>,
                      ]}
                      body={props.data?.map((object) => {
                        const percentage = (
                          ((object.table_size as number) / databaseSizeBytes) *
                          100
                        ).toFixed(2)

                        return (
                          <Table.tr key={`${object.schema_name}.${object.relname}`}>
                            <Table.td>
                              {object.schema_name}.{object.relname}
                            </Table.td>
                            <Table.td>
                              {formatBytes(object.table_size)} ({percentage}%)
                            </Table.td>
                          </Table.tr>
                        )
                      })}
                    />
                  )}
                </div>
              )
            }}
            append={() => (
              <div className="mt-2">
                <Alert_Shadcn_ variant="default" className="mt-4">
                  <AlertDescription_Shadcn_>
                    <p>
                      New Supabase projects have a database size of ~40-60mb. This space includes
                      pre-installed extensions, schemas, and default Postgres data. Additional
                      database size is used when installing extensions, even if those extensions are
                      inactive.
                    </p>

                    <p>
                      Please see our{' '}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand"
                        href="https://supabase.com/docs/guides/platform/database-size#database-space-management"
                      >
                        docs
                      </a>{' '}
                      for further information about database space and how to reduce database space.
                    </p>
                  </AlertDescription_Shadcn_>
                </Alert_Shadcn_>
              </div>
            )}
          />
        </section>
      </div>
    </>
  )
})

const useDatabaseReport = () => {
  const { ref: projectRef } = useParams()

  const queryHooks = queriesFactory<keyof typeof PRESET_CONFIG.database.queries>(
    PRESET_CONFIG.database.queries,
    projectRef ?? 'default'
  )
  const largestObjects = queryHooks.largestObjects()
  const activeHooks = [largestObjects]

  const handleRefresh = async () => {
    activeHooks.forEach((hook) => hook.runQuery())
  }
  const handleSetParams = (params: Partial<BaseReportParams>) => {
    activeHooks.forEach((hook) => {
      hook.setParams?.((prev) => ({ ...prev, ...params }))
    })
  }
  useEffect(() => {
    if (largestObjects.changeQuery) {
      largestObjects.changeQuery(PRESET_CONFIG.storage.queries.largestObjects.sql([]))
    }
  }, [])

  const isLoading = activeHooks.some((hook) => hook.isLoading)

  return {
    data: {
      largestObjects: largestObjects.data,
    },
    errors: {
      largestObjects: largestObjects.error,
    },
    params: {
      largestObjects: largestObjects.params,
    },
    mergeParams: handleSetParams,
    isLoading,
    refresh: handleRefresh,
  }
}
