import JSONFormatter from 'json-formatter-js'

export type UiResult =
  | {
      ok: true
      method: string
      data: unknown
    }
  | {
      ok: false
      method: string
      error: {
        httpCode?: number
        message: string
        details?: unknown
      }
    }

export function renderJson(result: UiResult, container: HTMLElement): void {
  container.innerHTML = ''

  const formatter = new JSONFormatter(result, 2, {
    theme: 'dark',
  })

  container.appendChild(formatter.render())
}


