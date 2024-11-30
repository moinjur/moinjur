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
    // 新增数据
    location: '',
    temperature: '',
    humidity: '',
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

    // 检查是否已有用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        isRegistered: app.globalData.isRegistered,
        phoneNumber: app.globalData.phoneNumber
      });
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    }

    // 获取位置和天气信息
    this.getLocation();
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
        this.getWeather(latitude, longitude);
      },
      fail: (err) => {
        console.error('获取位置失败：', err);
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
    });
  },

  // 获取天气信息
  getWeather(latitude, longitude) {
    // TODO: 调用天气API
    // 这里使用模拟数据
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

  // 更新每日推荐
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
  },

  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        this.getPhoneNumber();
      },
      fail: (err) => {
        console.error('获取用户信息失败：', err);
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
      app.login();
    }
  }
});