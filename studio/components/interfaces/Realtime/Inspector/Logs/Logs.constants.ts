const _SQL_FILTER_COMMON = {
  search_query: (value: string) => `regexp_contains(event_message, '${value}')`,
}

export const SQL_FILTER_TEMPLATES: any = {
  postgres_logs: {
    ..._SQL_FILTER_COMMON,
    'severity.error': `parsed.error_severity in ('ERROR', 'FATAL', 'PANIC')`,
    'severity.noError': `parsed.error_severity not in ('ERROR', 'FATAL', 'PANIC')`,
    'severity.log': `parsed.error_severity = 'LOG'`,
  },
  edge_logs: {
    ..._SQL_FILTER_COMMON,
    'status_code.error': `response.status_code between 500 and 599`,
    'status_code.success': `response.status_code between 200 and 299`,
    'status_code.warning': `response.status_code between 400 and 499`,

    'product.database': `request.path like '/rest/%' or request.path like '/graphql/%'`,
    'product.storage': `request.path like '/storage/%'`,
    'product.auth': `request.path like '/auth/%'`,
    'product.realtime': `request.path like '/realtime/%'`,

    'method.get': `request.method = 'GET'`,
    'method.post': `request.method = 'POST'`,
    'method.put': `request.method = 'PUT'`,
    'method.patch': `request.method = 'PATCH'`,
    'method.delete': `request.method = 'DELETE'`,
    'method.options': `request.method = 'OPTIONS'`,
  },
  function_edge_logs: {
    ..._SQL_FILTER_COMMON,
    'status_code.error': `response.status_code between 500 and 599`,
    'status_code.success': `response.status_code between 200 and 299`,
    'status_code.warning': `response.status_code between 400 and 499`,
  },
  function_logs: {
    ..._SQL_FILTER_COMMON,
    'severity.error': `metadata.level = 'error'`,
    'severity.notError': `metadata.level != 'error'`,
    'severity.log': `metadata.level = 'log'`,
    'severity.info': `metadata.level = 'info'`,
    'severity.debug': `metadata.level = 'debug'`,
    'severity.warn': `metadata.level = 'warn'`,
  },
  auth_logs: {
    ..._SQL_FILTER_COMMON,
    'severity.error': `metadata.level = 'error' or metadata.level = 'fatal'`,
    'severity.warning': `metadata.level = 'warning'`,
    'severity.info': `metadata.level = 'info'`,
    'status_code.server_error': `metadata.status between 500 and 599`,
    'status_code.client_error': `metadata.status between 400 and 499`,
    'status_code.redirection': `metadata.status between 300 and 399`,
    'status_code.success': `metadata.status between 200 and 299`,
    'endpoints.admin': `REGEXP_CONTAINS(metadata.path, "/admin")`,
    'endpoints.signup': `REGEXP_CONTAINS(metadata.path, "/signup|/invite|/verify")`,
    'endpoints.authentication': `REGEXP_CONTAINS(metadata.path, "/token|/authorize|/callback|/otp|/magiclink")`,
    'endpoints.recover': `REGEXP_CONTAINS(metadata.path, "/recover")`,
    'endpoints.user': `REGEXP_CONTAINS(metadata.path, "/user")`,
    'endpoints.logout': `REGEXP_CONTAINS(metadata.path, "/logout")`,
  },
  realtime_logs: {
    ..._SQL_FILTER_COMMON,
  },
  storage_logs: {
    ..._SQL_FILTER_COMMON,
  },
  postgrest_logs: {
    ..._SQL_FILTER_COMMON,
  },
  pgbouncer_logs: {
    ..._SQL_FILTER_COMMON,
  },
  supavisor_logs: {
    ..._SQL_FILTER_COMMON,
  },
}

export enum LogsTableName {
  EDGE = 'edge_logs',
  POSTGRES = 'postgres_logs',
  FUNCTIONS = 'function_logs',
  FN_EDGE = 'function_edge_logs',
  AUTH = 'auth_logs',
  REALTIME = 'realtime_logs',
  STORAGE = 'storage_logs',
  PGBOUNCER = 'pgbouncer_logs',
  POSTGREST = 'postgrest_logs',
  SUPAVISOR = 'supavisor_logs',
}

export const LOGS_TAILWIND_CLASSES = {
  log_selection_x_padding: 'px-8',
  space_y: 'px-6',
}
