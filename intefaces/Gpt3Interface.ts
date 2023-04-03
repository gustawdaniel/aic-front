export interface Gpt3Message {
  content: string
  role: 'system' | 'assistant' | 'user'
}

export interface DialogResponse {
  id: string,
  finish_reason: string
  message: Gpt3Message
}

export interface DialogMessage {
  text: string,
  finish_reason: string
  author: 'me' | 'ai'
  role: 'system' | 'assistant' | 'user'
  at: string
}
