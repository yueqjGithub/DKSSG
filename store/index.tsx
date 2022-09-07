import { createContext, Dispatch, useReducer } from 'react'
import { globalInfo, InitStates } from './state'

type ActionType = {
  key: string
  val: any
  type: 'set' | 'get'
}

type Props = {
  children: React.ReactElement,
  [key: string]: any
}

const Context = createContext<{ state: InitStates, dispatch?: Dispatch<ActionType> }>({ state: globalInfo, dispatch: undefined })

const reducer = (state: InitStates, action: ActionType) => {
  switch (action.type) {
    case 'set':
      return { ...state, [action.key]: action.val }
    case 'get':
      return state[action.key]
  }
}

const ContextProvider = (props: Props) => {
  const [state, dispatch] = useReducer(reducer, globalInfo)
  const { children } = props
  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  )
}

export { ContextProvider, Context }
