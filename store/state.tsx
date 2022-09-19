const isProd = process.env.NODE_ENV === 'production'
export type InitStates = {
  sideExpand: boolean
  showReserve: boolean
  currentScreen: number
  sideTab: string[]
  auth?: {
    uid: string
    token: string
  }
  isLogin: boolean
  codes: any[] // 兑换码进度
  shareFrom?: string
  [key: string]: any
  imgPrefix: string
  denyScroll: boolean
}

export const globalInfo: InitStates = {
  imgPrefix: isProd ? '.' : '',
  sideExpand: true,
  showReserve: false,
  currentScreen: 0,
  sideTab: ['首頁', '裏程碑', '任務', '業務特色', '員工簡歷'],
  auth: undefined,
  isLogin: false,
  codes: [],
  shareFrom: undefined,
  denyScroll: false
}
