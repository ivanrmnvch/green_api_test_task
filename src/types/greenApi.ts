export interface GreenApiConfig {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export interface ApiErrorCommon {
  httpCode?: number;
  errorId?: string;
  message: string;
  details?: unknown;
}

export interface GetSettingsResponse {
  wid: string;
  countryInstance?: string;
  typeAccount?: string;
  webhookUrl: string | null;
  webhookUrlToken: string | null;
  delaySendMessagesMilliseconds: number;
  markIncomingMessagesReaded: string;
  markIncomingMessagesReadedOnReply: string;
  sharedSession?: string;
  outgoingWebhook: string;
  outgoingMessageWebhook: string;
  outgoingAPIMessageWebhook: string;
  incomingWebhook: string;
  deviceWebhook?: string;
  statusInstanceWebhook?: string;
  stateWebhook: string;
  enableMessagesHistory?: string;
  keepOnlineStatus: string;
  pollMessageWebhook: string;
  incomingBlockWebhook?: string;
  incomingCallWebhook: string;
  editedMessageWebhook: string;
  deletedMessageWebhook: string;
}

export interface GetStateInstanceResponse {
  stateInstance:
    | 'notAuthorized'
    | 'authorized'
    | 'blocked'
    | 'sleepMode'
    | 'starting'
    | 'yellowCard'
    | string;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface SendFileByUrlResponse {
  idMessage: string;
}


