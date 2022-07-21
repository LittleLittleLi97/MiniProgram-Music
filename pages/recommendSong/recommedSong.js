import request from '../../utils/request'
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: 0, // 播放音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: ()=>{
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }

    // 初始化日期
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    });

    // 歌曲列表请求
    request('/recommend/songs').then((data)=>{
      this.setData({recommendList: data.data.dailySongs});
    });

    // 订阅songDetail
    PubSub.subscribe('switchType', (msg, type)=>{
      let {recommendList, index} = this.data;
      if (type === 'pre') {
        index = index === 0 ? recommendList.length - 1 : index - 1;
      } else {
        index = index === recommendList.length - 1 ? 0 : index + 1;
      }
      this.setData({index});
      let musicId = recommendList[index].id;
      PubSub.publish('musicId', musicId);
    })
  },

  toSongDetail(event) {
    let id = event.currentTarget.id;
    let index = event.currentTarget.dataset.index;
    this.setData({index});
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?id=' + id,
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