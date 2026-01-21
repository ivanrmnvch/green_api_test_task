import type { AppLayout } from './layout'
import type { GreenApiConfig } from '../types/greenApi'
import {
  getSettings,
  getStateInstance,
  mapAxiosError,
  sendFileByUrl,
  sendMessage,
} from '../api/greenApiClient'
import { renderJson, type UiResult } from './renderJson'

let config: GreenApiConfig | null = null

function getDefaultApiUrl(): string {
  return 'https://api.green-api.com'
}

function loadConfigFromStorage(): GreenApiConfig | null {
  try {
    const raw = window.localStorage.getItem('greenApiConfig')
    if (!raw) return null
    const parsed = JSON.parse(raw) as GreenApiConfig
    if (!parsed.idInstance || !parsed.apiTokenInstance || !parsed.apiUrl) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function saveConfigToStorage(next: GreenApiConfig): void {
  window.localStorage.setItem('greenApiConfig', JSON.stringify(next))
}

function updateConnectionStatus(
  layout: AppLayout,
  status: 'connected' | 'disconnected',
): void {
  if (status === 'connected') {
    layout.connection.statusLabel.textContent = 'Подключено'
    layout.connection.statusLabel.style.color = '#22c55e'
  } else {
    layout.connection.statusLabel.textContent = 'Не подключено'
    layout.connection.statusLabel.style.color = '#f97316'
  }
}

function setMethodsEnabled(layout: AppLayout, enabled: boolean): void {
  const { methods } = layout
  methods.getSettingsButton.disabled = !enabled
  methods.getStateButton.disabled = !enabled
  methods.sendMessageForm
    .querySelectorAll<HTMLButtonElement>('button[type="submit"]')
    .forEach((btn) => {
      btn.disabled = !enabled
    })
  methods.sendFileForm
    .querySelectorAll<HTMLButtonElement>('button[type="submit"]')
    .forEach((btn) => {
      btn.disabled = !enabled
    })
}

function showResult(layout: AppLayout, result: UiResult): void {
  renderJson(result, layout.results.container)
}

function validateConnectionInputs(
  idInstance: string,
  apiTokenInstance: string,
): string | null {
  if (!idInstance.trim()) return 'idInstance обязателен'
  if (!apiTokenInstance.trim()) return 'ApiTokenInstance обязателен'
  return null
}

export function bindHandlers(layout: AppLayout): void {
  const stored = loadConfigFromStorage()
  if (stored) {
    config = stored
    layout.connection.idInput.value = stored.idInstance
    layout.connection.tokenInput.value = stored.apiTokenInstance
    updateConnectionStatus(layout, 'connected')
    setMethodsEnabled(layout, true)
  } else {
    updateConnectionStatus(layout, 'disconnected')
    setMethodsEnabled(layout, false)
  }

  layout.connection.connectButton.addEventListener('click', () => {
    const idInstance = layout.connection.idInput.value
    const apiTokenInstance = layout.connection.tokenInput.value
    const errorMessage = validateConnectionInputs(idInstance, apiTokenInstance)

    if (errorMessage) {
      const result: UiResult = {
        ok: false,
        method: 'connection',
        error: {
          message: errorMessage,
        },
      }
      showResult(layout, result)
      updateConnectionStatus(layout, 'disconnected')
      setMethodsEnabled(layout, false)
      config = null
      return
    }

    const nextConfig: GreenApiConfig = {
      apiUrl: getDefaultApiUrl(),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    }

    config = nextConfig
    saveConfigToStorage(nextConfig)
    updateConnectionStatus(layout, 'connected')
    setMethodsEnabled(layout, true)

    const result: UiResult = {
      ok: true,
      method: 'connection',
      data: {
        message: 'Параметры подключения сохранены',
        apiUrl: nextConfig.apiUrl,
        idInstance: nextConfig.idInstance,
      },
    }

    showResult(layout, result)
  })

  layout.methods.getSettingsButton.addEventListener('click', async () => {
    if (!config) {
      const result: UiResult = {
        ok: false,
        method: 'getSettings',
        error: {
          message: 'Сначала сохраните параметры подключения',
        },
      }
      showResult(layout, result)
      return
    }

    try {
      const data = await getSettings(config)
      const result: UiResult = {
        ok: true,
        method: 'getSettings',
        data,
      }
      showResult(layout, result)
    } catch (error) {
      const mapped = mapAxiosError(error)
      const result: UiResult = {
        ok: false,
        method: 'getSettings',
        error: mapped,
      }
      showResult(layout, result)
    }
  })

  layout.methods.getStateButton.addEventListener('click', async () => {
    if (!config) {
      const result: UiResult = {
        ok: false,
        method: 'getStateInstance',
        error: {
          message: 'Сначала сохраните параметры подключения',
        },
      }
      showResult(layout, result)
      return
    }

    try {
      const data = await getStateInstance(config)
      const result: UiResult = {
        ok: true,
        method: 'getStateInstance',
        data,
      }
      showResult(layout, result)
    } catch (error) {
      const mapped = mapAxiosError(error)
      const result: UiResult = {
        ok: false,
        method: 'getStateInstance',
        error: mapped,
      }
      showResult(layout, result)
    }
  })

  layout.methods.sendMessageForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!config) {
      const result: UiResult = {
        ok: false,
        method: 'sendMessage',
        error: {
          message: 'Сначала сохраните параметры подключения',
        },
      }
      showResult(layout, result)
      return
    }

    const chatId = layout.methods.sendMessageChatIdInput.value.trim()
    const message = layout.methods.sendMessageTextInput.value.trim()

    if (!chatId) {
      const result: UiResult = {
        ok: false,
        method: 'sendMessage',
        error: {
          message: 'chatId обязателен',
        },
      }
      showResult(layout, result)
      return
    }

    if (!chatId.endsWith('@c.us') && !chatId.endsWith('@g.us')) {
      const result: UiResult = {
        ok: false,
        method: 'sendMessage',
        error: {
          message: 'chatId должен заканчиваться на @c.us или @g.us',
        },
      }
      showResult(layout, result)
      return
    }

    if (!message) {
      const result: UiResult = {
        ok: false,
        method: 'sendMessage',
        error: {
          message: 'Текст сообщения обязателен',
        },
      }
      showResult(layout, result)
      return
    }

    try {
      const data = await sendMessage(config, {
        chatId,
        message,
      })
      const result: UiResult = {
        ok: true,
        method: 'sendMessage',
        data,
      }
      showResult(layout, result)
      layout.methods.sendMessageTextInput.value = ''
    } catch (error) {
      const mapped = mapAxiosError(error)
      const result: UiResult = {
        ok: false,
        method: 'sendMessage',
        error: mapped,
      }
      showResult(layout, result)
    }
  })

  layout.methods.sendFileForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!config) {
      const result: UiResult = {
        ok: false,
        method: 'sendFileByUrl',
        error: {
          message: 'Сначала сохраните параметры подключения',
        },
      }
      showResult(layout, result)
      return
    }

    const chatId = layout.methods.sendFileChatIdInput.value.trim()
    const urlFile = layout.methods.sendFileUrlInput.value.trim()
    const fileName = layout.methods.sendFileNameInput.value.trim()
    const caption = layout.methods.sendFileCaptionInput.value.trim() || undefined

    if (!chatId) {
      const result: UiResult = {
        ok: false,
        method: 'sendFileByUrl',
        error: {
          message: 'chatId обязателен',
        },
      }
      showResult(layout, result)
      return
    }

    if (!urlFile) {
      const result: UiResult = {
        ok: false,
        method: 'sendFileByUrl',
        error: {
          message: 'urlFile обязателен',
        },
      }
      showResult(layout, result)
      return
    }

    if (!/^https?:\/\//i.test(urlFile)) {
      const result: UiResult = {
        ok: false,
        method: 'sendFileByUrl',
        error: {
          message: 'urlFile должен начинаться с http:// или https://',
        },
      }
      showResult(layout, result)
      return
    }

    if (!fileName || !fileName.includes('.')) {
      const result: UiResult = {
        ok: false,
        method: 'sendFileByUrl',
        error: {
          message: 'fileName обязателен и должен содержать расширение',
        },
      }
      showResult(layout, result)
      return
    }

    try {
      const data = await sendFileByUrl(config, {
        chatId,
        urlFile,
        fileName,
        caption,
      })
      const result: UiResult = {
        ok: true,
        method: 'sendFileByUrl',
        data,
      }
      showResult(layout, result)
    } catch (error) {
      const mapped = mapAxiosError(error)
      const result: UiResult = {
        ok: false,
        method: 'sendFileByUrl',
        error: mapped,
      }
      showResult(layout, result)
    }
  })
}


