interface Prompt {
  id: string
  value: string
}

export const usePrompts = () => {
  return useState<Map<string, Prompt[]>>('prompts', () => new Map())
}

export const useHeaderPrompt = () => {
  return useState<Prompt>('header-prompts', () => ({id: '', value: ''}))
}

export const useParagraphPrompt = () => {
  return useState<Prompt>('paragraph-prompts', () => ({id: '', value: ''}))
}

export const useCodePrompt = () => {
  return useState<Prompt>('code-prompts', () => ({id: '', value: ''}))
}

export const useCodePromptEnabled = () => {
  return useState<boolean>('code-prompts-enabled', () => true)
}

