export type FbLoginResult = {
  status: 1 | 2 | 3
  result: {
    uid?: string
    accessToken?: string
  }
}

export const FbLogin = () => {
  return new Promise<FbLoginResult>((resolve, reject) => {
    const result: FbLoginResult['result'] = {
      uid: undefined,
      accessToken: undefined,
    }
    window.FB.getLoginStatus(function(response: any){
      if (response.status === 'connected') { // 已经登录了
        result.uid = response.authResponse.userID
        result.accessToken = response.authResponse.accessToken
        resolve({
          status: 1,
          result
        })
      } else if (response.status === 'not_authorized') {
        // The user hasn't authorized your application.  They
        // must click the Login button, or you must call FB.login
        // in response to a user gesture, to launch a login dialog.
        window.FB.login(function (response1: any) {
          if (response1.authResponse) {
            result.uid = response1.authResponse.userID
            result.accessToken = response1.authResponse.accessToken
            resolve({
              status: 2,
              result
            })
          } else {
            reject('登录失败2：用户取消登录或未知错误')
          }
        }, {scope: 'public_profile,email'})
      } else {
        window.FB.login(function (response1: any) {
          console.log("3++", response1)
          if (response1.authResponse) {
            result.uid = response1.authResponse.userID
            result.accessToken = response1.authResponse.accessToken
            resolve({
              status: 3,
              result
            })
          } else {
            reject('登录失败3：用户取消登录或未知错误')
          }
        }, {scope: 'public_profile,email'})
      }
    })
  })
}