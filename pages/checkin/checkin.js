Page({
  data: {
    latitude: null,
    longitude: null,
    address: '',
    isChecked: false,
    isRecording: false,
    recordTime: 0,
    tempVoicePath: '',
    imageList: [],
    videoPath: '',
    videoThumb: '',
    maxImageCount: 9,
    maxDuration: 60,
    recordTimer: null
  },

  onLoad() {
    this.checkTodayCheckin();
  },

  // 检查今日是否已打卡
  checkTodayCheckin() {
    const today = new Date().toLocaleDateString();
    const checkinRecord = wx.getStorageSync('checkinRecord') || {};
    this.setData({
      isChecked: !!checkinRecord[today]
    });
  },

  // 获取精确位置
  getLocation() {
    wx.showLoading({
      title: '定位中...'
    });

    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 3000,
      success: (res) => {
        const { latitude, longitude } = res;
        this.setData({ latitude, longitude });
        this.getAddress(latitude, longitude);
      },
      fail: (err) => {
        console.error('定位失败：', err);
        wx.showToast({
          title: '定位失败',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // 获取地址信息
  getAddress(latitude, longitude) {
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=YOUR_KEY`,
      success: (res) => {
        if (res.data.status === 0) {
          this.setData({
            address: res.data.result.address
          });
        }
      }
    });
  },

  // 打卡
  handleCheckin() {
    if (!this.data.latitude || !this.data.longitude) {
      this.getLocation();
      return;
    }

    const today = new Date().toLocaleDateString();
    const checkinRecord = wx.getStorageSync('checkinRecord') || {};
    
    checkinRecord[today] = {
      time: new Date().toLocaleTimeString(),
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      address: this.data.address,
      voice: this.data.tempVoicePath,
      images: this.data.imageList,
      video: this.data.videoPath
    };

    wx.setStorageSync('checkinRecord', checkinRecord);
    
    this.setData({ isChecked: true });
    wx.showToast({
      title: '打卡成功',
      icon: 'success'
    });
  },

  // 开始录音
  startRecord() {
    this.setData({ 
      isRecording: true,
      recordTime: 0
    });

    const recorderManager = wx.getRecorderManager();
    recorderManager.start({
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    });

    // 计时器
    this.data.recordTimer = setInterval(() => {
      this.setData({
        recordTime: this.data.recordTime + 1
      });
    }, 1000);

    recorderManager.onStop((res) => {
      this.setData({
        tempVoicePath: res.tempFilePath,
        isRecording: false
      });
      clearInterval(this.data.recordTimer);
    });
  },

  // 停止录音
  stopRecord() {
    const recorderManager = wx.getRecorderManager();
    recorderManager.stop();
  },

  // 播放录音
  playVoice() {
    if (!this.data.tempVoicePath) return;
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = this.data.tempVoicePath;
    innerAudioContext.play();
  },

  // 选择图片
  chooseImage() {
    const remainCount = this.data.maxImageCount - this.data.imageList.length;
    if (remainCount <= 0) {
      wx.showToast({
        title: '最多选择9张图片',
        icon: 'none'
      });
      return;
    }

    wx.chooseImage({
      count: remainCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imageList: [...this.data.imageList, ...res.tempFilePaths]
        });
      }
    });
  },

  // 预览图片
  previewImage(e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current,
      urls: this.data.imageList
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const imageList = this.data.imageList;
    imageList.splice(index, 1);
    this.setData({ imageList });
  },

  // 选择视频
  chooseVideo() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: this.data.maxDuration,
      camera: 'back',
      success: (res) => {
        this.setData({
          videoPath: res.tempFilePath,
          videoThumb: res.thumbTempFilePath
        });
      }
    });
  },

  // 播放视频
  playVideo() {
    if (!this.data.videoPath) return;
    wx.createVideoContext('checkinVideo').requestFullScreen();
  },

  // 删除视频
  deleteVideo() {
    this.setData({
      videoPath: '',
      videoThumb: ''
    });
  }
});