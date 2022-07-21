import config from './config'

export default (url, data={}, method='GET')=>{
  let cookie = wx.getStorageSync('cookies');
  return new Promise((resolve, reject)=>{
    wx.request({
      url: config.host + url,
      data: {
        ...data,
        cookie: cookie && cookie.join('')
      },
      method,
      success: (res)=>{
        if (data.isLogin) {
          wx.setStorageSync('cookies', res.cookies);
        }
        resolve(res.data);
      },
      fail: (err)=>{
        reject(err);
      }
    })
  })
}