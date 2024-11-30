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

  globalData: {
    userInfo: null
  }
});