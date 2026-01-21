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
  container: HTMLElement
}

export interface AppLayout {
  root: HTMLElement
  connection: ConnectionBlock
  methods: MethodsBlock
  results: ResultsBlock
}

function createConnectionBlock(section: HTMLElement): ConnectionBlock {
  section.className = 'panel panel-connection'

  const title = document.createElement('h2')
  title.textContent = 'Подключение к GREEN-API'

  const description = document.createElement('p')
  description.className = 'panel-description'
  description.textContent =
    'Введите idInstance и ApiTokenInstance из личного кабинета GREEN-API'

  const idLabel = document.createElement('label')
  idLabel.textContent = 'idInstance'

  const idInput = document.createElement('input')
  idInput.type = 'text'
  idInput.placeholder = '1101790001'

  const tokenLabel = document.createElement('label')
  tokenLabel.textContent = 'ApiTokenInstance'

  const tokenInput = document.createElement('input')
  tokenInput.type = 'password'
  tokenInput.placeholder = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

  const controlsRow = document.createElement('div')
  controlsRow.className = 'connection-controls'

  const connectButton = document.createElement('button')
  connectButton.type = 'button'
  connectButton.textContent = 'Сохранить подключение'

  const statusLabel = document.createElement('span')
  statusLabel.className = 'connection-status'
  statusLabel.textContent = 'Не подключено'

  controlsRow.append(connectButton, statusLabel)

  section.append(
    title,
    description,
    idLabel,
    idInput,
    tokenLabel,
    tokenInput,
    controlsRow,
  )

  return {
    section,
    idInput,
    tokenInput,
    connectButton,
    statusLabel,
  }
}

function createMethodsBlock(section: HTMLElement): MethodsBlock {
  section.className = 'panel panel-methods'

  const title = document.createElement('h2')
  title.textContent = 'Методы GREEN-API'

  const buttonsRow = document.createElement('div')
  buttonsRow.className = 'methods-row'

  const getSettingsButton = document.createElement('button')
  getSettingsButton.type = 'button'
  getSettingsButton.textContent = 'getSettings'

  const getStateButton = document.createElement('button')
  getStateButton.type = 'button'
  getStateButton.textContent = 'getStateInstance'

  buttonsRow.append(getSettingsButton, getStateButton)

  const sendMessageForm = document.createElement('form')
  sendMessageForm.className = 'method-form'

  const sendMessageTitle = document.createElement('h3')
  sendMessageTitle.textContent = 'sendMessage'

  const sendMessageChatIdInput = document.createElement('input')
  sendMessageChatIdInput.type = 'text'
  sendMessageChatIdInput.placeholder = 'chatId (7999...@c.us)'

  const sendMessageTextInput = document.createElement('textarea')
  sendMessageTextInput.rows = 3
  sendMessageTextInput.placeholder = 'Текст сообщения'

  const sendMessageSubmit = document.createElement('button')
  sendMessageSubmit.type = 'submit'
  sendMessageSubmit.textContent = 'Отправить сообщение'

  sendMessageForm.append(
    sendMessageTitle,
    sendMessageChatIdInput,
    sendMessageTextInput,
    sendMessageSubmit,
  )

  const sendFileForm = document.createElement('form')
  sendFileForm.className = 'method-form'

  const sendFileTitle = document.createElement('h3')
  sendFileTitle.textContent = 'sendFileByUrl'

  const sendFileChatIdInput = document.createElement('input')
  sendFileChatIdInput.type = 'text'
  sendFileChatIdInput.placeholder = 'chatId (7999...@c.us)'

  const sendFileUrlInput = document.createElement('input')
  sendFileUrlInput.type = 'url'
  sendFileUrlInput.placeholder = 'urlFile (https://...)'

  const sendFileNameInput = document.createElement('input')
  sendFileNameInput.type = 'text'
  sendFileNameInput.placeholder = 'fileName (file.png)'

  const sendFileCaptionInput = document.createElement('input')
  sendFileCaptionInput.type = 'text'
  sendFileCaptionInput.placeholder = 'caption (опционально)'

  const sendFileSubmit = document.createElement('button')
  sendFileSubmit.type = 'submit'
  sendFileSubmit.textContent = 'Отправить файл'

  sendFileForm.append(
    sendFileTitle,
    sendFileChatIdInput,
    sendFileUrlInput,
    sendFileNameInput,
    sendFileCaptionInput,
    sendFileSubmit,
  )

  section.append(title, buttonsRow, sendMessageForm, sendFileForm)

  return {
    section,
    getSettingsButton,
    getStateButton,
    sendMessageForm,
    sendMessageChatIdInput,
    sendMessageTextInput,
    sendFileForm,
    sendFileChatIdInput,
    sendFileUrlInput,
    sendFileNameInput,
    sendFileCaptionInput,
  }
}

function createResultsBlock(section: HTMLElement): ResultsBlock {
  section.className = 'panel panel-results'

  const title = document.createElement('h2')
  title.textContent = 'Ответы методов'

  const container = document.createElement('div')
  container.className = 'results-json'

  section.append(title, container)

  return {
    section,
    container,
  }
}

export function initLayout(root: HTMLElement): AppLayout {
  const connectionSection =
    (root.querySelector<HTMLElement>('#connection-section') ??
      document.createElement('section'))

  const methodsSection =
    (root.querySelector<HTMLElement>('#methods-section') ??
      document.createElement('section'))

  const resultsSection =
    (root.querySelector<HTMLElement>('#results-section') ??
      document.createElement('section'))

  if (!connectionSection.parentElement) {
    root.appendChild(connectionSection)
  }
  if (!methodsSection.parentElement) {
    root.appendChild(methodsSection)
  }
  if (!resultsSection.parentElement) {
    root.appendChild(resultsSection)
  }

  const connection = createConnectionBlock(connectionSection)
  const methods = createMethodsBlock(methodsSection)
  const results = createResultsBlock(resultsSection)

  return {
    root,
    connection,
    methods,
    results,
  }
}


