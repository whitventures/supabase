import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'

import { get } from 'data/fetchers'
import { ResponseError } from 'types'
import { documentKeys } from './keys'

export type DocumentVariables = {
  orgSlug?: string
  docType?: string
}

export type DocumentResponse = {
  link: string
}

export async function getDocument({ orgSlug, docType }: DocumentVariables, signal?: AbortSignal) {
  if (!orgSlug) throw new Error('orgSlug is required')

  // @ts-ignore Just a sample here, TS lint will validate if the endpoint is valid
  const { data, error } = await get(`/platform/organizations/{slug}/documents/{docType}`, {
    params: { path: { slug: orgSlug, docType } },
    signal,
  })
  if (error) throw error

  return data
}

export type DocumentData = Awaited<ReturnType<typeof getDocument>>
export type DocumentError = ResponseError

export const useDocumentQuery = <TData = DocumentData>(
  { orgSlug, docType }: DocumentVariables,
  { enabled = true, ...options }: UseQueryOptions<DocumentData, DocumentError, TData> = {}
) =>
  useQuery<DocumentData, DocumentError, TData>(
    documentKeys.resource(orgSlug, docType),
    ({ signal }) => getDocument({ orgSlug, docType }, signal),
    {
      enabled: enabled && typeof orgSlug !== 'undefined' && typeof docType !== 'undefined',
      ...options,
    }
  )