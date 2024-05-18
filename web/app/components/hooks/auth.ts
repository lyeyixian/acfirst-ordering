import { useMatches } from '@remix-run/react'

export const useAuth = () => {
  const matches = useMatches()
  let isAuthRoute = false

  for (const match of matches) {
    if (match.id.includes('auth')) {
      isAuthRoute = true
    }
  }

  return {
    isAuthRoute,
  }
}
