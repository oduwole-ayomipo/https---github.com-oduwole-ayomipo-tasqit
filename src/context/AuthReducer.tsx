interface AuthState {
  authToken: string | null | undefined
}

interface AuthAction {
  type: string
  payload: string
}

export const AuthReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        authToken: action.payload
      }
    }
    case 'REGISTER': {
      return {
        authToken: action.payload
      }
    }
    case 'LOGOUT': {
      return {
        authToken: null
      }
    }
    default:
      return state
  }
}
