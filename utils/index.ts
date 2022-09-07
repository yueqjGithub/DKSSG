export const isJsonObject = (obj: any) => {
  try {
    JSON.stringify(obj)
    return true
  } catch {
    return false
  }
}

export const isJsonString = (obj?: string) => {
  if (!obj) {
    return false
  }
  try {
    JSON.parse(obj)
    return true
  } catch {
    return false
  }
}

type GetTargetPayload = {
  [key: string]: any
}

export const getTarget = (target: string | number, payload: GetTargetPayload) => {
  const result = payload[target]
  if (isJsonString(result)) {
    return JSON.parse(result)
  } else {
    return result
  }
}

export const debounce = (fn: Function, delay: number) => {
  let timer: any
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export const getScrollDirection = (e: any) => {
  if (e.wheelDelta) {
    if (e.wheelDelta > 0) {
      return 'up'
    } else {
      return 'down'
    }
  } else if (e.detail) {
    if (e.detail > 0) {
      return 'down'
    } else {
      return 'up'
    }
  }
}

export const throttle = (fn: Function, delay: number) => {
  let timer: any
  return (...args: any) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn(...args)
        timer = null
      }, delay)
    }
  }
}

/** 复制 */
export const copyHandler = (copyContent: any) => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(String(copyContent))
  } else {
    const txt = document.createElement('textarea')
    txt.textContent = String(copyContent)
    txt.style.width = '0'
    txt.style.height = '0'
    document.body.appendChild(txt)
    txt.focus()
    document.execCommand('SelectAll')
    const suc = document.execCommand('Copy')
    document.body.removeChild(txt)
    if (suc) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('Copy failed'))
    }
  }
}