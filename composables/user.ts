export const useUser = () => {
  return useCookie<{email: string, avatar: string, full_name: string} | null>('user')
}
