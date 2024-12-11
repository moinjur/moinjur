// 初始化云开发
wx.cloud.init({
  env: 'your-env-id', // 替换为你的云开发环境ID
  traceUser: true
});

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
    
    // 获取手机号
    this.getPhoneNumber();
  },

  // 获取手机号
  getPhoneNumber() {
    wx.showModal({
      title: '欢迎使用',
      content: '请先绑定手机号完成注册',
      showCancel: false,
      success: () => {
        // 显示获取手机号按钮
        this.globalData.showPhoneAuth = true;
        if (this.showPhoneAuthCallback) {
          this.showPhoneAuthCallback();
        }
      }
    });
  },

  // 保存用户信息到云数据库
  async saveUserInfo(phoneNumber) {
    try {
      const db = wx.cloud.database();
      const userInfo = this.globalData.userInfo || {};
      
      // 保存用户信息
      await db.collection('users').add({
        data: {
          phoneNumber,
          ...userInfo,
          createTime: db.serverDate()
        }
      });

      // 获取位置权限
      this.getLocationAuth();
    } catch (err) {
      console.error('保存用户信息失败：', err);
    }
  },

  // 获取位置权限
  getLocationAuth() {
    wx.authorize({
      scope: 'scope.userLocation',
      success: () => {
        this.globalData.hasLocationAuth = true;
        if (this.locationAuthCallback) {
          this.locationAuthCallback();
        }
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '需要获取您的地理位置，请确认授权',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        });
      }
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
    showPhoneAuth: false,
    hasLocationAuth: false
  }
});