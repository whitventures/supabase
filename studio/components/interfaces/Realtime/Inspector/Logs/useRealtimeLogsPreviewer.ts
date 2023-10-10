import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { LogData } from 'components/interfaces/Settings/Logs'
import { uuidv4 } from 'lib/helpers'
import { EMPTY_ARR } from 'lib/void'
import { sortBy, take } from 'lodash'
import { useCallback, useEffect, useReducer, useState } from 'react'

function reducer(
  state: LogData[],
  action: { type: 'add'; payload: { eventType: string; metadata: any } } | { type: 'clear' }
) {
  if (action.type === 'clear') {
    return EMPTY_ARR
  }

  const newState = take(
    sortBy(
      [
        {
          id: uuidv4(),
          timestamp: new Date().getTime(),
          event_message: action.payload.eventType,
          metadata: action.payload.metadata,
        } as LogData,
        ...state,
      ],
      (l) => -l.timestamp
    ),
    100
  )

  return newState
}

export interface UseRealtimeLogsPreviewParams {
  enabled: boolean
  channelName: string
  projectRef: string
  logLevel: string
  token: string
  schema: string
  table: string
  tableId: number | undefined
  filter: string | undefined
  bearer: string | null
  enableBroadcast: boolean
  enablePresence: boolean
  enableDbChanges: boolean
}

const useRealtimeLogsPreview = ({
  enabled,
  channelName,
  projectRef,
  logLevel,
  token,
  schema,
  table,
  filter,
  bearer,
  enablePresence,
  enableDbChanges,
  enableBroadcast,
}: UseRealtimeLogsPreviewParams) => {
  const host = `https://${projectRef}.supabase.co`
  const [logData, dispatch] = useReducer(reducer, [] as LogData[])
  const pushEvent = (eventType: string, metadata: any) => {
    dispatch({ type: 'add', payload: { eventType, metadata } })
  }

  // Instantiate our client with the Realtime server and params to connect with
  let [client, setClient] = useState<SupabaseClient<any, 'public', any> | undefined>()
  let [channel, setChannel] = useState<RealtimeChannel | undefined>()

  useEffect(() => {
    if (!enabled) {
      return
    }
    console.log('connect')
    const opts = {
      realtime: {
        params: {
          log_level: logLevel,
        },
      },
    }
    const newClient = createClient(host, token, opts)
    if (bearer != '') {
      newClient.realtime.setAuth(bearer)
    }

    setClient(newClient)
    return () => {
      console.log('disconnect')
      client?.realtime.disconnect()
      setClient(undefined)
    }
  }, [enabled, bearer, host, logLevel, token])

  useEffect(() => {
    if (!client) {
      return
    }
    dispatch({ type: 'clear' })
    console.log('subscribe')
    const newChannel = client?.channel(channelName, {
      config: { broadcast: { self: true } },
    })
    // Hack to confirm Postgres is subscribed
    // Need to add 'extension' key in the 'payload'
    newChannel.on('system' as any, {} as any, (payload: any) => {
      // if (payload.extension === 'postgres_changes' && payload.status === 'ok') {
      //   pushEventTo('#conn_info', 'postgres_subscribed', {})
      // }
      pushEvent('SYSTEM', payload)
    })

    if (enableBroadcast) {
      // Listen for all (`*`) `broadcast` events
      // The event name can by anything
      // Match on specific event names to filter for only those types of events and do something with them
      newChannel.on('broadcast', { event: '*' }, (payload) => pushEvent('BROADCAST', payload))
    }

    // Listen for all (`*`) `presence` events
    if (enablePresence) {
      newChannel.on('presence' as any, { event: '*' }, (payload) => {
        pushEvent('PRESENCE', payload)
      })
    }

    // Listen for all (`*`) `postgres_changes` events on tables in the `public` schema
    if (enableDbChanges) {
      let postgres_changes_opts: any = {
        event: '*',
        schema: schema,
        table: table,
        filter: undefined,
      }
      if (filter !== '') {
        postgres_changes_opts.filter = filter
      }
      newChannel.on('postgres_changes' as any, postgres_changes_opts, (payload: any) => {
        let ts = performance.now() + performance.timeOrigin
        let payload_ts = Date.parse(payload.commit_timestamp)
        let latency = ts - payload_ts
        pushEvent('POSTGRES', { ...payload, latency })
      })
    }

    // Finally, subscribe to the Channel we just setup
    newChannel.subscribe(async (status, error) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Realtime Channel status: ${status}`)

        // Let LiveView know we connected so we can update the button text
        // pushEventTo('#conn_info', 'broadcast_subscribed', { host: host })

        if (enablePresence) {
          const name = 'user_name_' + Math.floor(Math.random() * 100)
          newChannel.send({
            type: 'presence',
            event: 'TRACK',
            payload: { name: name, t: performance.now() },
          })
        }
      } else if (status === 'CLOSED') {
        console.log(`Realtime Channel status: ${status}`)
      } else {
        console.error(`Realtime Channel error status: ${status}`)
        console.error(`Realtime Channel error: ${error}`)
      }
    })

    setChannel(newChannel)
    return () => {
      console.log('unsubscribe')
      newChannel.unsubscribe()
      setChannel(undefined)
    }
  }, [
    client,
    channelName,
    enableBroadcast,
    enableDbChanges,
    enablePresence,
    filter,
    host,
    schema,
    table,
  ])

  const sendEvent = useCallback(
    (event, payload) => {
      channel?.send({
        type: 'broadcast',
        event,
        payload,
      })
    },
    [channel]
  )
  return { logData, sendEvent }
}

// const clearLocalStorage = () => {
//   localStorage.clear()
// }

// const mounted = () => {
//   let params = {
//     log_level: localStorage.getItem('log_level'),
//     token: localStorage.getItem('token'),
//     host: localStorage.getItem('host'),
//     channel: localStorage.getItem('channel'),
//     schema: localStorage.getItem('schema'),
//     table: localStorage.getItem('table'),
//     filter: localStorage.getItem('filter'),
//     bearer: localStorage.getItem('bearer'),
//     enable_presence: localStorage.getItem('enable_presence'),
//     enable_db_changes: localStorage.getItem('enable_db_changes'),
//   }

//   pushEventTo('#conn_form', 'local_storage', params)

//   // handleEvent('connect', ({ connection }) =>
//   //   initRealtime(
//   //     connection.channel,
//   //     connection.host,
//   //     connection.log_level,
//   //     connection.token,
//   //     connection.schema,
//   //     connection.table,
//   //     connection.filter,
//   //     connection.bearer,
//   //     connection.enable_presence,
//   //     connection.enable_db_changes
//   //   )
//   // )

//   // handleEvent('send_message', ({ message }) =>
//   //   sendRealtime(message.event, message.payload)
//   // )

//   // handleEvent('disconnect', ({}) => this.disconnectRealtime())

//   // handleEvent('clear_local_storage', ({}) => this.clearLocalStorage())
// }

// Hooks.latency = {
//   mounted() {
//     this.handleEvent('ping', (params) => this.pong(params))
//   },

//   pong(params) {
//     this.pushEventTo('#ping', 'pong', params)
//   },
// }

// let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute('content')

// let liveSocket = new LiveSocket('/live', Socket, {
//   hooks: Hooks,
//   params: { _csrf_token: csrfToken },
// })

// topbar.config({ barColors: { 0: '#29d' }, shadowColor: 'rgba(0, 0, 0, .3)' })
// window.addEventListener('phx:page-loading-start', (info) => topbar.show())
// window.addEventListener('phx:page-loading-stop', (info) => topbar.hide())

// liveSocket.connect()

// window.liveSocket = liveSocket

// useRealtime(
//   'room_a',
//   'https://pxidrgkatumlvfqaxcll.supabase.co',
//   'info',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aWRyZ2thdHVtbHZmcWF4Y2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5OTUzOTgsImV4cCI6MTk4NDU3MTM5OH0.d_yYtASLzAoIIGdXUBIgRAGLBnNow7JG2SoaNMQ8ySg',
//   'public',
//   '*',
//   '',
//   '',
//   true,
//   true
// )

export default useRealtimeLogsPreview
