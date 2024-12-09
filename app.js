App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 检查是否首次登录
    const isFirstLogin = !wx.getStorageSync('hasLogin');
    if (isFirstLogin) {
      this.handleFirstLogin();
    } else {
      this.login();
    }
  },

  // 处理首次登录
  handleFirstLogin() {
    // 标记已登录
    wx.setStorageSync('hasLogin', true);
    
    // 按顺序请求授权
    this.requestAuth();
  },

  // 请求授权
  requestAuth() {
    wx.showModal({
      title: '欢迎使用',
      content: '为了提供更好的服务，需要获取您的微信账号和手机号',
      success: (res) => {
        if (res.confirm) {
          this.getUserProfile();
        }
      }
    });
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.globalData.userInfo = res.userInfo;
        wx.setStorageSync('userInfo', res.userInfo);
        
        // 获取手机号
        this.getPhoneNumber();
      },
      fail: (err) => {
        console.error('获取用户信息失败：', err);
      }
    });
  },

  // 获取手机号
  getPhoneNumber() {
    wx.showModal({
      title: '提示',
      content: '是否使用微信手机号快速注册？',
      success: (res) => {
        if (res.confirm) {
          wx.getPhoneNumber({
            success: (res) => {
              this.globalData.phoneNumber = res.phoneNumber;
              wx.setStorageSync('phoneNumber', res.phoneNumber);
              
              // 完成注册
              this.completeRegistration();
            },
            fail: (err) => {
              console.error('获取手机号失败：', err);
            }
          });
        }
      }
    });
  },

  // 完成注册
  completeRegistration() {
    // TODO: 调用后端接口完成注册
    console.log('注册完成');
    wx.showToast({
      title: '注册成功',
      icon: 'success'
    });
  },

  // 常规登录
  login() {
    wx.login({
      success: res => {
        if (res.code) {
          // TODO: 调用后端接口登录
          console.log('登录成功，code:', res.code);
        }
      }
    });
  },

  globalData: {
    userInfo: null,
    phoneNumber: null,
    isFirstLogin: true
  }
});