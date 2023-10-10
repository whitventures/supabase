import { LOGS_TAILWIND_CLASSES } from '../Logs.constants'
import LogsDivider from '../Logs.Divider'
import { LogData } from '../Logs.types'
import { jsonSyntaxHighlight, SelectionDetailedTimestampRow } from '../LogsFormatters'

const DatabasePostgresSelectionRender = ({ log }: { log: LogData }) => {
  return (
    <>
      <div className={LOGS_TAILWIND_CLASSES.log_selection_x_padding}>
        <span className="col-span-4 text-sm text-scale-900">Event message</span>

        <div className="text-wrap mt-2 overflow-x-auto whitespace-pre-wrap font-mono  text-xs text-scale-1200">
          {log.event_message}
        </div>
      </div>
      <LogsDivider />
      <div className={`${LOGS_TAILWIND_CLASSES.log_selection_x_padding} space-y-2`}>
        <SelectionDetailedTimestampRow value={log.timestamp} />
      </div>
      <LogsDivider />
      <div className={LOGS_TAILWIND_CLASSES.log_selection_x_padding}>
        <h3 className="mb-4 text-lg text-scale-1200">Metadata</h3>
        <pre className="syntax-highlight overflow-x-auto text-sm">
          <div
            className="text-wrap"
            dangerouslySetInnerHTML={{
              __html: log.metadata ? jsonSyntaxHighlight(log.metadata) : '',
            }}
          />
        </pre>
      </div>
    </>
  )
}

export default DatabasePostgresSelectionRender
