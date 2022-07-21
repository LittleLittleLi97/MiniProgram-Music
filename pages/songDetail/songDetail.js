import request from '../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'

const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    song: {},
    id: '',
    musicLink: '',
    currentTime: '00:00',
    durationTime: '00:00',
    currentWidth: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let id = options.id;
    this.setData({id});
    let musicState = this.getMusicInfo(id);
    musicState.then(()=>wx.setNavigationBarTitle({
      title: this.data.song.name,
    }));

    // 当前页面音乐是否在播放
    if (appInstance.globalData.musicId == id) {
      this.setData({isPlay: appInstance.globalData.isMusicPlay});
    }

    this.bgAudioManager = wx.getBackgroundAudioManager();
    this.bgAudioManager.onPlay(()=>{
      this.changePlayState(true);
      appInstance.globalData.musicId = id;
    });
    this.bgAudioManager.onPause(()=>{
      this.changePlayState(false);
    });
    this.bgAudioManager.onStop(()=>{
      this.changePlayState(false);
    })
    this.bgAudioManager.onTimeUpdate(()=>{
      let currentTime = moment(this.bgAudioManager.currentTime * 1000).format('mm:ss');
      let currentWidth = this.bgAudioManager.currentTime / this.bgAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      });
    })
    this.bgAudioManager.onEnded(()=>{
      // 自然播放结束后，自动切换到下一首音乐
      PubSub.publish('switchType', 'next');
    })
  },

  changePlayState(isPlay) {
    this.setData({isPlay});
    appInstance.globalData.isMusicPlay = isPlay;
  },

  getMusicInfo(id) {
    return request('/song/detail', {ids: id}).then((data)=>{
      let durationTime = moment(data.songs[0].dt).format('mm:ss');
      this.setData({
        song: data.songs[0],
        durationTime
      });
    });
  },

  // 音乐播放的状态
  handleMusicPlay() {
    this.setData({isPlay: !this.data.isPlay});
    this.musicControl(this.data.isPlay, this.data.id, this.data.musicLink);
  },

  // 控制音乐播放
  async musicControl(isPlay, id, musicLink) {
    let bgAudioManager = this.bgAudioManager;
    if (isPlay) {
      if (!musicLink) {
        // 用await阻塞一下，不然下面设置bgAudioManager时数据还没回来
        await request('/song/url', {id}).then((data)=>{
          musicLink = data.data[0].url;
          this.setData({musicLink});
        });
      }
      bgAudioManager.src = musicLink;
      bgAudioManager.title = this.data.song.name;
    } else {
      bgAudioManager.pause();
    }
  },

  // 切歌
  handleSwitch(event) {
    let type = event.currentTarget.id;
    PubSub.subscribe('musicId', (msg, musicId)=>{
      this.bgAudioManager.stop();
      this.getMusicInfo(musicId);
      this.musicControl(true, musicId);
      PubSub.unsubscribe('musicId');
    })
    PubSub.publish('switchType', type);
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