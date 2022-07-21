// pages/video/video.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: [],
    videoId: '',
    isTriggered: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 导航数据
    request('/video/group/list').then((data)=>this.setData({
      videoGroupList: data.data.slice(0, 14),
      navId: data.data[0].id
    })).then(()=>this.getVideoList(this.data.navId)); // 拿到navId后获取其视频列表
  },

  // 切换导航选项
  changeNav(event) {
    let id = event.currentTarget.id;
    this.setData({
      navId: id,
      videoList: [] // 清空，效果更好
    });
    wx.showLoading({title: '正在加载'});
    let res = this.getVideoList(this.data.navId);
    res.then(()=>wx.hideLoading());
  },
  
  getVideoList(id) {
    return request('/video/group', {id}).then((data)=>{
      let arr = data.datas.map((item)=>{
        return request('/video/url', {id: item.data.vid}).then((data)=>{
          let res = data.urls[0];
          res.info = item;
          return res;
        })
      })
      return Promise.all(arr).then((data)=>{
        this.setData({videoList: data});
      });
    })
  },

  handlePlay(event) {
    let vid = event.currentTarget.id;
    this.setData({videoId: vid});
    this.videoContext = wx.createVideoContext(vid); // 将实例绑定到了this上
  },

  // 下拉刷新
  handleRefresher() {
    let res = this.getVideoList(this.data.navId);
    res.then(()=>this.setData({isTriggered: false}));
  },

  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
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