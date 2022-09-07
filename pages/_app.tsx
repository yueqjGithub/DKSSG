import '../styles/global.scss'
import '../styles/app.scss'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { Context, ContextProvider } from '../store'

function MyApp({ Component, pageProps }: AppProps) {
  const { state } = useContext(Context)
  const router = useRouter()
  useEffect(() => {
    if (window.location.search) {
      state.shareFrom = window.location.search.substring(1)
    }
    const wd = document.body.clientWidth
    const path = router.pathname
    if (path === '/') {
      if (wd < 750) {
        router.push('/mobile')
      } else {
        router.push('/pc')
      }
    } else {
      if (path.search('/mobile') !== -1 && wd > 750) {
        router.push('/pc')
      } else if (path.search('/pc') !== -1 && wd <= 750) {
        router.push('/mobile')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  )
}

export default MyApp
