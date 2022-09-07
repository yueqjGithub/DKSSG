let baseUrl = process.env.NEXT_PUBLIC_REQUEST_HOST

const  urls = {
  baseUrl: baseUrl,
  getAttr: '/api/attrs/DK',
  shareLink: '/api/fixed/DK/share_links',
  qrCode: '/api/fixed/DK/left_qrcode',
  downBtn: '/api/fixed/DK/side_download',
  queryVideoSource: '/api/fixed/DK/video',
  getReserveOne: '/api/fixed/DK/reserve_one',
  getReserveTwo: '/api/fixed/DK/reserve_two',
  getReserveThree: '/api/fixed/DK/reserve_three',
  getReserveFour: '/api/fixed/DK/reserve_four',
  getReserveFive: '/api/fixed/DK/reserve_five',
  getFbOne: '/api/fixed/DK/fb_one',
  getFbTwo: '/api/fixed/DK/fb_two',
  getInviteOne: '/api/fixed/DK/invite_one',
  getInviteTwo: '/api/fixed/DK/invite_two',
  getInviteThree: '/api/fixed/DK/invite_three',
  getBanner: '/api/fixed/DK/carsoul',
  getGameRoles: '/api/fixed/dkRoles/DK',
  // mobile
  getMTopInfo: '/api/fixed/DK/mobile_top_logo',
  // user
  login: '/user/login',
  getReserveCount: '/user/reserve/number',
  getExchangeCode: '/user/exchangeCodes',
  doReserve: '/user/reserve',
  getInvite: '/user/share',
  logout: '/user/logout',
}

export default urls