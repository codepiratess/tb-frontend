/**
 * Utility to set/clear auth cookies for TownBolt.
 * These cookies are readable by Next.js Edge Middleware.
 */

export function setAuthCookies(accessToken: string, role: string) {
  if (typeof window === 'undefined') return
  
  const accessMaxAge = 15 * 60 // 15 mins
  const roleMaxAge = 7 * 24 * 60 * 60 // 7 days
  
  document.cookie = 
    `townbolt_token=${accessToken};` +
    `max-age=${accessMaxAge};` +
    `path=/;SameSite=Lax`
    
  document.cookie = 
    `townbolt_role=${role};` +
    `max-age=${roleMaxAge};` +
    `path=/;SameSite=Lax`
}

export function clearAuthCookies() {
  if (typeof window === 'undefined') return
  document.cookie = 'townbolt_token=;max-age=0;path=/'
  document.cookie = 'townbolt_role=;max-age=0;path=/'
}
