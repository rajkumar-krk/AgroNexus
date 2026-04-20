import { useState, useEffect, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export interface AuthUser {
  _id: string
  fullName: string
  email: string
  phone?: string
  role?: string
  language?: string
  profilePhoto?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('agronexus_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('agronexus_user') }
    }
    setLoading(false)
  }, [])

  const saveUser = useCallback((userData: AuthUser) => {
    setUser(userData)
    localStorage.setItem('agronexus_user', JSON.stringify(userData))
  }, [])

  const signup = useCallback(async (fullName: string, email: string, password: string, phone?: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, phone }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || data.error || 'Registration failed')
    saveUser(data.data.user)
    return data.data.user
  }, [saveUser])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || data.error || 'Login failed')
    saveUser(data.data.user)
    return data.data.user
  }, [saveUser])

  const googleLogin = useCallback(async () => {
    return new Promise<AuthUser>((resolve, reject) => {
      // Check if Google Identity Services library loaded
      const google = (window as any).google
      if (!google?.accounts?.id) {
        reject(new Error(
          'Google Sign-In is not available. Please add http://localhost:3000 as an Authorized JavaScript Origin in your Google Cloud Console → Credentials → OAuth 2.0 Client ID.'
        ))
        return
      }

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            if (!response?.credential) {
              throw new Error('No credential received from Google')
            }
            // Decode the credential JWT
            const parts = response.credential.split('.')
            if (parts.length < 2) throw new Error('Invalid credential format')
            const payload = JSON.parse(atob(parts[1]))
            
            const res = await fetch(`${API_URL}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                googleId: payload.sub,
                email: payload.email,
                fullName: payload.name,
                profilePhoto: payload.picture,
              }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Google auth failed')
            saveUser(data.data.user)
            resolve(data.data.user)
          } catch (err) {
            reject(err)
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      // Use One Tap prompt
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason()
          if (reason === 'opt_out_or_no_session') {
            reject(new Error('No Google session found. Please sign in to your Google account in this browser first.'))
          } else if (reason === 'suppressed_by_user') {
            reject(new Error('Google Sign-In was previously dismissed. Try clearing your browser cookies for accounts.google.com.'))
          } else {
            reject(new Error(
              `Google Sign-In blocked (${reason}). Go to Google Cloud Console → Credentials → Your OAuth Client ID → Add http://localhost:3000 to "Authorized JavaScript origins".`
            ))
          }
        }
        if (notification.isSkippedMoment()) {
          reject(new Error('Google Sign-In was skipped. Please try again.'))
        }
      })
    })
  }, [saveUser])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('agronexus_user')
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signup,
    login,
    googleLogin,
    logout,
  }
}
