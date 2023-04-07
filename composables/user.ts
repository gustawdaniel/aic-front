type UserRole = 'admin' | 'hacker' | 'pro';

export const useUser = () => {
  return useCookie<{email: string, avatar: string, full_name: string, roles: UserRole[]} | null>('user')
}
