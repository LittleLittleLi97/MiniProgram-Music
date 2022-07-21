// pages/index/index.js
import request from '../../utils/request';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 轮播图
    request('/banner', {type: 2}).then((data)=>this.setData({bannerList: data.banners}));
    // 推荐歌单
    request('/personalized', {limit: 10}).then((data)=>this.setData({
      recommendList: data.result
    }));
    // 排行榜
    request('/toplist').then((data)=>{
      data = data.list.slice(0, 3);
      let arr = data.map((item)=>{
        return request('/playlist/track/all', {
          id: item.id,
          limit: 3
        }).then((data)=>{
          return {
            id: item.id,
            listInfo: item,
            songs: data.songs
          }
        });
      })
      Promise.all(arr).then((data)=>this.setData({topList: data}));
    })
    // let topListArr = [];
    // for (let i = 0; i < 5; i++) {
    //   request('/top/list', {idx: i}).then((data)=>topListArr.push({
    //     name: data.playlist.name,
    //     tracks: data.playlist.tracks.slice(0, 3)
    //   })).then(()=>this.setData({topList: topListArr}));
    // }
  },

  toRecommendSong() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommedSong',
    });
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