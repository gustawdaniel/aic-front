export const useSearch = () => {
  return useState<{ enabled: boolean, text: string }>('search', () => ({
    enabled: false,
    text: ''
  }))
}
