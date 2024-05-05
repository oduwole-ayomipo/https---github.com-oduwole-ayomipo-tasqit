'use client'

import { useEffect, createContext, useContext, useReducer } from 'react'
import { AuthReducer } from './AuthReducer'

interface InitialStateType {
  authToken: string | null | undefined
  dispatch: React.Dispatch<any>
}

// Check if window is defined (indicating that we're in a browser environment)
const authTokenString =
  typeof window !== 'undefined' ? localStorage.getItem('user') : null

const INITIAL_STATE: InitialStateType = {
  authToken: authTokenString != null ? JSON.parse(authTokenString) : null,
  dispatch: () => {}
}

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

  useEffect(() => {
    // Check if window is defined before accessing localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(state.authToken))
    }
  }, [state.authToken])

  return (
    <AuthContext.Provider value={{ authToken: state.authToken, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
