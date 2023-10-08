import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { TIME_PERIODS_INFRA } from 'lib/constants'
import { formatBytes } from 'lib/helpers'
import { NextPageWithLayout } from 'types'
import { AlertDescription_Shadcn_, Alert_Shadcn_, IconArrowRight, Loading } from 'ui'

import { ReportsLayout } from 'components/layouts'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import ChartHandler from 'components/to-be-cleaned/Charts/ChartHandler'
import DateRangePicker from 'components/to-be-cleaned/DateRangePicker'
import Panel from 'components/ui/Panel'
import SparkBar from 'components/ui/SparkBar'
import { useDatabaseSizeQuery } from 'data/database/database-size-query'
import { useDatabaseLargestObjectsQuery } from 'data/database/database-largest-objects-query'

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
  const { data: largestObjects, isSuccess: loadedLargestObjects } = useDatabaseLargestObjectsQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
  })
  const databaseSizeBytes = data?.result[0].db_size ?? 0

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

          <Panel
            title={
              <div className="flex justify-between w-full">
                <h2>Database size</h2>
                <span className="text-lg tracking-wide">{formatBytes(databaseSizeBytes)}</span>
              </div>
            }
          >
            <Panel.Content>
              <div className="space-y-1">
                <span className="text-md">Largest Objects</span>

                <Loading active={!loadedLargestObjects}>
                  <div className="space-y-3 mt-4">
                    {largestObjects?.result?.map((object) => (
                      <div key={`${object.schema_name}.${object.relname}`}>
                        <SparkBar
                          type="horizontal"
                          value={object.table_size}
                          max={databaseSizeBytes}
                          barClass={`bg-brand`}
                          bgClass="bg-gray-300 dark:bg-gray-600"
                          labelBottom={`${object.schema_name}.${object.relname}`}
                          labelTop={formatBytes(object.table_size)}
                        />
                      </div>
                    ))}
                  </div>

                  <Alert_Shadcn_ variant="default" className="mt-4">
                    <AlertDescription_Shadcn_>
                      Please see our{' '}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand"
                        href="https://supabase.com/docs/guides/platform/database-size#database-space-management"
                      >
                        docs
                      </a>{' '}
                      for further information about database space and how to further reduce
                      database space.
                    </AlertDescription_Shadcn_>
                  </Alert_Shadcn_>
                </Loading>
              </div>
            </Panel.Content>
          </Panel>
        </section>
      </div>
    </>
  )
})
