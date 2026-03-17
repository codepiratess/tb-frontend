/**
 * Helper to handle Google login button click using next-auth.
 */

export async function handleGoogleLogin() {
  const { signIn } = await import('next-auth/react')
  await signIn('google', { 
    callbackUrl: '/' 
  })
}
