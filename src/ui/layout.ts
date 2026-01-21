export interface ConnectionBlock {
  section: HTMLElement
  idInput: HTMLInputElement
  tokenInput: HTMLInputElement
  connectButton: HTMLButtonElement
  statusLabel: HTMLElement
}

export interface MethodsBlock {
  section: HTMLElement
  getSettingsButton: HTMLButtonElement
  getStateButton: HTMLButtonElement
  sendMessageForm: HTMLFormElement
  sendMessageChatIdInput: HTMLInputElement
  sendMessageTextInput: HTMLTextAreaElement
  sendFileForm: HTMLFormElement
  sendFileChatIdInput: HTMLInputElement
  sendFileUrlInput: HTMLInputElement
  sendFileNameInput: HTMLInputElement
  sendFileCaptionInput: HTMLInputElement
}

export interface ResultsBlock {
  section: HTMLElement
  alert: HTMLElement
  container: HTMLElement
}

export interface AppLayout {
  root: HTMLElement
  connection: ConnectionBlock
  methods: MethodsBlock
  results: ResultsBlock
}

function findElement<T extends HTMLElement>(
  root: HTMLElement,
  selector: string,
  errorMessage: string,
): T {
  const element = root.querySelector<T>(selector)
  if (!element) {
    throw new Error(errorMessage)
  }
  return element
}

export function initLayout(root: HTMLElement): AppLayout {
  const connectionSection = findElement<HTMLElement>(
    root,
    '#connection-section',
    'Connection section not found',
  )

  const methodsSection = findElement<HTMLElement>(
    root,
    '#methods-section',
    'Methods section not found',
  )

  const resultsSection = findElement<HTMLElement>(
    root,
    '#results-section',
    'Results section not found',
  )

  const connection: ConnectionBlock = {
    section: connectionSection,
    idInput: findElement<HTMLInputElement>(
      root,
      '#id-instance',
      'idInstance input not found',
    ),
    tokenInput: findElement<HTMLInputElement>(
      root,
      '#api-token',
      'apiToken input not found',
    ),
    connectButton: findElement<HTMLButtonElement>(
      root,
      '#connect-button',
      'Connect button not found',
    ),
    statusLabel: findElement<HTMLElement>(
      root,
      '#connection-status',
      'Connection status label not found',
    ),
  }

  const methods: MethodsBlock = {
    section: methodsSection,
    getSettingsButton: findElement<HTMLButtonElement>(
      root,
      '#get-settings-button',
      'getSettings button not found',
    ),
    getStateButton: findElement<HTMLButtonElement>(
      root,
      '#get-state-button',
      'getStateInstance button not found',
    ),
    sendMessageForm: findElement<HTMLFormElement>(
      root,
      '#send-message-form',
      'sendMessage form not found',
    ),
    sendMessageChatIdInput: findElement<HTMLInputElement>(
      root,
      '#send-message-chat-id',
      'sendMessage chatId input not found',
    ),
    sendMessageTextInput: findElement<HTMLTextAreaElement>(
      root,
      '#send-message-text',
      'sendMessage text input not found',
    ),
    sendFileForm: findElement<HTMLFormElement>(
      root,
      '#send-file-form',
      'sendFileByUrl form not found',
    ),
    sendFileChatIdInput: findElement<HTMLInputElement>(
      root,
      '#send-file-chat-id',
      'sendFileByUrl chatId input not found',
    ),
    sendFileUrlInput: findElement<HTMLInputElement>(
      root,
      '#send-file-url',
      'sendFileByUrl url input not found',
    ),
    sendFileNameInput: findElement<HTMLInputElement>(
      root,
      '#send-file-name',
      'sendFileByUrl fileName input not found',
    ),
    sendFileCaptionInput: findElement<HTMLInputElement>(
      root,
      '#send-file-caption',
      'sendFileByUrl caption input not found',
    ),
  }

  const results: ResultsBlock = {
    section: resultsSection,
    alert: findElement<HTMLElement>(
      root,
      '#results-alert',
      'Results alert not found',
    ),
    container: findElement<HTMLElement>(
      root,
      '#results-container',
      'Results container not found',
    ),
  }

  return {
    root,
    connection,
    methods,
    results,
  }
}


