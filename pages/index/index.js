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

  // 检查位置权限
  checkLocationAuth() {
    wx.getSetting({
      success: (res) => {
        const isAuth = res.authSetting['scope.userLocation'];
        this.setData({ hasLocationAuth: isAuth });
        if (isAuth) {
          this.getLocation();
        } else {
          this.requestLocationAuth();
        }
      }
    });
  },

  // 请求位置权限
  requestLocationAuth() {
    wx.authorize({
      scope: 'scope.userLocation',
      success: () => {
        this.setData({ hasLocationAuth: true });
        this.getLocation();
      },
      fail: () => {
        wx.showModal({
          title: '需要位置权限',
          content: '需要获取您的地理位置才能为您推荐养生方案，是否授权？',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (settingRes) => {
                  if (settingRes.authSetting['scope.userLocation']) {
                    this.setData({ hasLocationAuth: true });
                    this.getLocation();
                  }
                }
              });
            } else {
              // 用户拒绝授权，使用默认推荐
              this.useDefaultRecommendations();
            }
          }
        });
      }
    });
  },

  // 获取位置信息
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        this.setData({
          location: `${latitude},${longitude}`
        });
        // 保存位置信息到本地
        wx.setStorageSync('lastLocation', { latitude, longitude });
        this.getWeather(latitude, longitude);
      },
      fail: (err) => {
        console.error('获取位置失败：', err);
        // 尝试使用上次保存的位置
        const lastLocation = wx.getStorageSync('lastLocation');
        if (lastLocation) {
          this.getWeather(lastLocation.latitude, lastLocation.longitude);
        } else {
          this.useDefaultRecommendations();
        }
      }
    });
  },

  // 使用默认推荐
  useDefaultRecommendations() {
    this.setData({
      temperature: '25°C',
      humidity: '65%',
      weatherSuggestions: [
        {
          title: '今日养生建议',
          items: ['清淡饮食', '适量运动', '保持作息规律']
        }
      ]
    });
    this.updateDailyRecommends();
  },

  getUserProfile(e) {
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

        this.getPhoneNumber();
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

  getPhoneNumber(e) {
    if (e && e.detail.errMsg === 'getPhoneNumber:ok') {
      const phoneNumber = e.detail.phoneNumber;
      this.setData({
        phoneNumber: phoneNumber,
        isRegistered: true
      });
      app.globalData.phoneNumber = phoneNumber;
      app.globalData.isRegistered = true;
      this.register(phoneNumber);
    }
  },

  register(phoneNumber) {
    console.log('注册用户，手机号：', phoneNumber);
    wx.showToast({
      title: '注册成功',
      icon: 'success'
    });
  },

  handleLogin() {
    if (!this.data.hasUserInfo) {
      this.getUserProfile();
    }
  },

  getWeather(latitude, longitude) {
    // TODO: 调用天气API
    this.setData({
      temperature: '25°C',
      humidity: '65%',
      weatherSuggestions: [
        {
          title: '天气温暖，建议食用',
          items: ['清淡饮食', '养生茶饮', '时令水果']
        }
      ]
    });
    this.updateDailyRecommends();
  },

  updateDailyRecommends() {
    const temp = parseInt(this.data.temperature);
    let items = [];
    
    if (temp > 30) {
      items = ['绿豆汤', '薄荷茶', '凉拌黄瓜'];
    } else if (temp > 20) {
      items = ['菊花茶', '山楂水', '水果沙拉'];
    } else {
      items = ['生姜茶', '红枣汤', '羊肉汤'];
    }

    const dailyRecommends = [{
      id: 1,
      title: '当季养生推荐',
      desc: `当前温度${this.data.temperature}，湿度${this.data.humidity}`,
      items: items
    }];

    this.setData({ dailyRecommends });
  }
});