App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 登录
    this.login();
  },

  login() {
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          // 获取用户信息
          wx.getUserProfile({
            desc: '用于完善用户资料',
            success: (profileRes) => {
              this.globalData.userInfo = profileRes.userInfo;
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(profileRes);
              }
              // 获取手机号
              this.getPhoneNumber();
            },
            fail: (err) => {
              console.error('获取用户信息失败：', err);
            }
          });
        } else {
          console.error('登录失败：' + res.errMsg);
        }
      }
    });
  },

  getPhoneNumber() {
    wx.showModal({
      title: '提示',
      content: '是否使用微信手机号快速注册？',
      success: (res) => {
        if (res.confirm) {
          // 调用获取手机号接口
          wx.getPhoneNumber({
            success: (res) => {
              this.globalData.phoneNumber = res.phoneNumber;
              // TODO: 调用后端接口进行注册
              this.register(res.phoneNumber);
            },
            fail: (err) => {
              console.error('获取手机号失败：', err);
            }
          });
        }
      }
    });
  },

  register(phoneNumber) {
    // TODO: 实现注册逻辑
    console.log('注册用户，手机号：', phoneNumber);
    // 可以调用后端接口进行注册
  },

  globalData: {
    userInfo: null,
    phoneNumber: null,
    isRegistered: false
  }
});