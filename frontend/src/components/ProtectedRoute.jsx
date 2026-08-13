import {
  useEffect,
  useState
} from 'react'

import {
  Navigate
} from 'react-router-dom'

import {
  getCurrentUser
} from '../services/api'

function ProtectedRoute({ children }) {
  const [status, setStatus] =
    useState('loading')

  useEffect(() => {
    const checkAuthentication =
      async () => {
        try {
          await getCurrentUser()

          setStatus('authenticated')
        } catch {
          setStatus('unauthenticated')
        }
      }

    checkAuthentication()
  }, [])

  if (status === 'loading') {
    return (
      <main className="page-container">
        <p>Checking session...</p>
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute