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
    phoneNumber: ''
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
        // 获取手机号
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
      // TODO: 调用注册接口
      this.register(phoneNumber);
    }
  },

  register(phoneNumber) {
    // TODO: 实现注册逻辑
    console.log('注册用户，手机号：', phoneNumber);
    wx.showToast({
      title: '注册成功',
      icon: 'success'
    });
  },

  // 处理登录
  handleLogin() {
    if (!this.data.hasUserInfo) {
      app.login();
    }
  }
});