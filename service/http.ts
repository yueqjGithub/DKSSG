import axios from 'axios'
import urls from './urls'
import querystring from 'querystring'

type HttpFunc = (url: string, data?: any, params?: any) => Promise<any>

const whiteList = [urls.login, urls.getReserveCount]

const http = axios.create({
  baseURL: urls.baseUrl,
  timeout: 30000
})

http.interceptors.response.use(response => {
  if (response.data.status === 0) {
    return response
  } else if (response.data.status === 5100) {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.location.reload()
    return Promise.reject("登錄信息過期")
  }
  return Promise.reject(response.data)
})

const httpPost: HttpFunc = (url, data = {}) => {
  return http({
    url,
    data: querystring.stringify(data),
    method: 'POST'
  })
}

const httpGet: HttpFunc = (url, params = {}) => {
  return http({
    url,
    params,
    method: 'GET'
  })
}

const normalHttp: HttpFunc = (url, data, method) => {
  return axios({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}

const httpDel: HttpFunc = (url, params = {}) => {
  return http({
    url,
    params,
    method: 'DELETE'
  })
}

const httpPatch: HttpFunc = (url, params = {}) => {
  return http({
    url,
    params,
    method: 'PATCH'
  })
}

export { httpPost, httpGet, normalHttp, httpDel, httpPatch }