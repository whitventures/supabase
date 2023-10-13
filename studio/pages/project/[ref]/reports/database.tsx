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
import SparkBar from 'components/ui/SparkBar'
import { useDatabaseSizeQuery } from 'data/database/database-size-query'
import ReportWidget from 'components/interfaces/Reports/ReportWidget'
import { useParams } from 'common'
import { queriesFactory } from 'components/interfaces/Reports/Reports.utils'
import {
  PRESET_CONFIG,
  REPORTS_DATEPICKER_HELPERS,
} from 'components/interfaces/Reports/Reports.constants'
import { BaseReportParams } from 'components/interfaces/Reports/Reports.types'
import ReportPadding from 'components/interfaces/Reports/ReportPadding'
import ReportHeader from 'components/interfaces/Reports/ReportHeader'
import ReportFilterBar from 'components/interfaces/Reports/ReportFilterBar'
import ShimmerLine from 'components/ui/ShimmerLine'
import { DatePickerToFrom } from 'components/interfaces/Settings/Logs'
import DatePickers from 'components/interfaces/Settings/Logs/Logs.DatePickers'

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

  const handleDatepickerChange = ({ from, to }: DatePickerToFrom) => {
    report.mergeParams({
      iso_timestamp_start: from || '',
      iso_timestamp_end: to || '',
    })
  }

  return (
    <ReportPadding>
      <ReportHeader title="Database" isLoading={report.isLoading} onRefresh={report.refresh} />
      <div className="w-full flex flex-col gap-1">
        <div>
          <div className="flex flex-row justify-start items-center flex-wrap gap-2">
            <DatePickers
              onChange={handleDatepickerChange}
              from={report.params.largestObjects.iso_timestamp_start!}
              to={report.params.largestObjects.iso_timestamp_end!}
              helpers={REPORTS_DATEPICKER_HELPERS}
            />
          </div>
        </div>
        <div className="h-2 w-full">
          <ShimmerLine active={report.isLoading} />
        </div>
      </div>
      <div>
        <section>
          <Panel title={<h2>Database health</h2>}>
            <Panel.Content>
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
                    <div className="space-y-3 mt-4">
                      {props.data?.map((object) => {
                        const percentage = (
                          ((object.table_size as number) / databaseSizeBytes) *
                          100
                        ).toFixed(2)

                        return (
                          <div key={`${object.schema_name}.${object.relname}`}>
                            <SparkBar
                              type="horizontal"
                              value={object.table_size}
                              max={databaseSizeBytes}
                              barClass={`bg-brand`}
                              bgClass="bg-gray-300 dark:bg-gray-600"
                              labelBottom={`${object.schema_name}.${object.relname} - ${formatBytes(
                                object.table_size
                              )} (${percentage}%)`}
                            />
                          </div>
                        )
                      })}
                    </div>
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
                      for further information about database space and how to further reduce
                      database space.
                    </p>
                  </AlertDescription_Shadcn_>
                </Alert_Shadcn_>
              </div>
            )}
          />
        </section>
      </div>
    </ReportPadding>
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
