// pages/search/search.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',
    hotList: [],
    searchContent: '',
    searchList: [],
    historyList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInitData();
  },

  getInitData() {
    this.getSearchHistory();

    request('/search/default').then((data)=>{
      this.setData({
        placeholderContent: data.data.showKeyword
      });
    });
    request('/search/hot/detail').then((data)=>{
      this.setData({
        hotList: data.data
      });
    })
  },

  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory');
    if (historyList) {
      this.setData({historyList});
    }
  },

  handleInputChange(event) {
    this.setData({searchContent: event.detail.value.trim()});
    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{
      if (!this.data.searchContent) {
        this.setData({searchList: []});
        return;
      }
      let { searchContent, historyList } = this.data;
      request('/search', {
        keywords: searchContent,
        limit: 10
      }).then((data)=>{
        if (historyList.indexOf(searchContent) !== -1) {
          historyList.splice(historyList.indexOf(searchContent), 1);
        }
        historyList.unshift(searchContent);
        this.setData({
          searchList: data.result.songs,
          historyList
        });
        wx.setStorageSync('searchHistory', historyList);
      });
    }, 300);
  },

  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: []
    });
  },
  
  deleteSearchHistory() {
    wx.showModal({
      content: '确定删除吗？',
      success: (res)=>{
        if (res.confirm) {
          this.setData({
            historyList: []
          });
          wx.removeStorageSync('searchHistory');
        }
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