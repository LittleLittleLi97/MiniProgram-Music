// pages/login/login.js
import request from '../../utils/request';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  handleInput(event) {
    let type = event.currentTarget.id;
    let value = event.detail.value;
    this.setData({
      [type]: value
    });
  },

  login() {
    let { phone, password } = this.data;
    phone = phone.trim();
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'error'
      });
      return;
    }
    const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'error'
      });
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      });
      return;
    }
    request('/login/cellphone', {phone, password, isLogin: true}).then((data)=>{
      if (data.code === 200) {
        wx.showToast({title: '登录成功'});
        wx.setStorageSync('userInfo', JSON.stringify(data.profile));
        wx.reLaunch({url: '/pages/personal/personal'});
      } else {
        wx.showToast({
          title: data.message,
          icon: 'error'
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})