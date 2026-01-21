import axios, { AxiosError, type AxiosInstance } from 'axios'
import type {
  ApiErrorCommon,
  GetSettingsResponse,
  GetStateInstanceResponse,
  GreenApiConfig,
  SendFileByUrlResponse,
  SendMessageResponse,
} from '../types/greenApi'

export function buildUrl(config: GreenApiConfig, method: string): string {
  const trimmedBase = config.apiUrl.replace(/\/+$/, '')
  return `${trimmedBase}/waInstance${config.idInstance}/${method}/${config.apiTokenInstance}`
}

function createAxiosInstance(): AxiosInstance {
  return axios.create({
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const http = createAxiosInstance()

export function mapAxiosError(error: unknown): ApiErrorCommon {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ error?: string; message?: string }>
    const httpCode = err.response?.status
    const body = err.response?.data

    const rawMessage = body?.message || body?.error || err.message

    let friendlyMessage = rawMessage || 'Unexpected error while calling GREEN-API'

    if (httpCode === 400) {
      friendlyMessage =
        rawMessage ||
        '400 Bad Request: проверьте параметры запроса (Validation failed, chatId, message и др.)'
    }

    if (httpCode === 401) {
      friendlyMessage =
        rawMessage || '401 Unauthorized: проверьте ApiTokenInstance и права доступа'
    }

    if (httpCode === 403) {
      friendlyMessage =
        rawMessage || '403 Forbidden: проверьте idInstance и корректность URL'
    }

    if (httpCode === 404) {
      friendlyMessage =
        rawMessage || '404 Not Found: проверьте HTTP-метод и путь запроса'
    }

    if (httpCode === 429) {
      friendlyMessage =
        rawMessage ||
        '429 Too Many Requests: превышен лимит запросов, уменьшите частоту вызовов'
    }

    if (httpCode === 500) {
      friendlyMessage =
        rawMessage ||
        '500 Internal Server Error: ошибка на стороне GREEN-API, попробуйте повторить запрос позже'
    }

    if (httpCode === 502) {
      friendlyMessage =
        rawMessage ||
        '502 Bad Gateway: сервер не получил ответ от целевого сервиса, повторите запрос позднее'
    }

    return {
      httpCode,
      message: friendlyMessage,
      details: body,
    }
  }

  return {
    message: error instanceof Error ? error.message : 'Unknown error',
  }
}

export async function getSettings(
  config: GreenApiConfig,
): Promise<GetSettingsResponse> {
  const url = buildUrl(config, 'getSettings')
  const response = await http.get<GetSettingsResponse>(url)
  return response.data
}

export async function getStateInstance(
  config: GreenApiConfig,
): Promise<GetStateInstanceResponse> {
  const url = buildUrl(config, 'getStateInstance')
  const response = await http.get<GetStateInstanceResponse>(url)
  return response.data
}

export interface SendMessagePayload {
  chatId: string
  message: string
  quotedMessageId?: string
  linkPreview?: boolean
  typePreview?: 'large' | 'small'
  customPreview?: {
    title: string
    description?: string
    link?: string
    urlFile?: string
    jpegThumbnail?: string
  }
  typingTime?: number
}

export async function sendMessage(
  config: GreenApiConfig,
  payload: SendMessagePayload,
): Promise<SendMessageResponse> {
  const url = buildUrl(config, 'sendMessage')
  const response = await http.post<SendMessageResponse>(url, payload)
  return response.data
}

export interface SendFileByUrlPayload {
  chatId: string
  urlFile: string
  fileName: string
  caption?: string
  quotedMessageId?: string
  typingTime?: number
  typingType?: string
}

export async function sendFileByUrl(
  config: GreenApiConfig,
  payload: SendFileByUrlPayload,
): Promise<SendFileByUrlResponse> {
  const url = buildUrl(config, 'sendFileByUrl')
  const response = await http.post<SendFileByUrlResponse>(url, payload)
  return response.data
}


