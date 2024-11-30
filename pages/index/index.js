const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    isRegistered: false,
    phoneNumber: '',
    location: '',
    temperature: '',
    humidity: '',
    isLoading: false,
    hasLocationAuth: false,
    dailyRecommends: [
      {
        id: 1,
        title: '当季养生推荐',
        desc: '根据天气情况推荐',
        items: []
      }
    ],
    weatherSuggestions: []
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }

    // 检查本地存储的用户信息
    const storedUserInfo = wx.getStorageSync('userInfo');
    if (storedUserInfo) {
      this.setData({
        userInfo: storedUserInfo,
        hasUserInfo: true
      });
      app.globalData.userInfo = storedUserInfo;
    }

    // 检查位置权限并获取位置
    this.checkLocationAuth();
  },

  // 修改登录方法，确保只在用户点击时调用
  handleUserProfile(e) {
    if (this.data.isLoading) return;
    
    this.setData({ isLoading: true });

    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo);
        
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });

        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });

        // 登录成功后再获取手机号
        if (!this.data.isRegistered) {
          this.showGetPhoneNumber();
        }
      },
      fail: (err) => {
        console.error('获取用户信息失败：', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ isLoading: false });
      }
    });
  },

  // 显示获取手机号提示
  showGetPhoneNumber() {
    wx.showModal({
      title: '提示',
      content: '是否使用手机号完成注册？',
      success: (res) => {
        if (res.confirm) {
          // 用户确认后才显示获取手机号按钮
          this.setData({
            showPhoneButton: true
          });
        }
      }
    });
  },

  // 保持原有方法
  getUserProfile: function(e) {
    this.handleUserProfile(e);
  },

  getPhoneNumber(e) {
    if (e && e.detail.errMsg === 'getPhoneNumber:ok') {
      const phoneNumber = e.detail.phoneNumber;
      this.setData({
        phoneNumber: phoneNumber,
        isRegistered: true,
        showPhoneButton: false
      });
      app.globalData.phoneNumber = phoneNumber;
      app.globalData.isRegistered = true;
      this.register(phoneNumber);
    }
  },

  // 保持其他原有方法...
  checkLocationAuth() {
    // 保持原有代码
  },

  requestLocationAuth() {
    // 保持原有代码
  },

  getLocation() {
    // 保持原有代码
  },

  useDefaultRecommendations() {
    // 保持原有代码
  },

  register(phoneNumber) {
    // 保持原有代码
  },

  handleLogin() {
    if (!this.data.hasUserInfo) {
      this.handleUserProfile();
    }
  },

  getWeather(latitude, longitude) {
    // 保持原有代码
  },

  updateDailyRecommends() {
    // 保持原有代码
  }
});