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
    showRegister: true,
    registerType: '',
    manualPhoneNumber: '',
    verificationCode: '',
    showVerificationInput: false,
    // 新增登录相关数据
    isFirstLogin: true,
    isPhoneVerified: false,
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

    // 检查是否首次登录
    const isFirstLogin = !wx.getStorageSync('hasLoggedIn');
    const isPhoneVerified = wx.getStorageSync('isPhoneVerified');
    
    this.setData({
      isFirstLogin,
      isPhoneVerified
    });

    // 如果已验证手机号，直接跳转主页
    if (isPhoneVerified) {
      this.navigateToMain();
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

  // 验证手机号
  verifyPhoneNumber(phoneNumber) {
    // TODO: 调用后端验证接口
    return new Promise((resolve) => {
      setTimeout(() => {
        wx.setStorageSync('isPhoneVerified', true);
        this.setData({ isPhoneVerified: true });
        resolve(true);
      }, 1000);
    });
  },

  // 跳转到主页
  navigateToMain() {
    wx.setStorageSync('hasLoggedIn', true);
    
    // 重新加载当前页面作为主页
    this.setData({
      showRegister: false,
      isFirstLogin: false
    });

    wx.showToast({
      title: '登录成功',
      icon: 'success'
    });
  },

  // 处理登录成功
  async handleLoginSuccess(phoneNumber) {
    try {
      await this.verifyPhoneNumber(phoneNumber);
      this.navigateToMain();
    } catch (error) {
      console.error('手机号验证失败：', error);
      wx.showToast({
        title: '手机号验证失败',
        icon: 'none'
      });
    }
  },

  // 修改原有方法
  register(phoneNumber) {
    console.log('注册用户，手机号：', phoneNumber);
    
    wx.setStorageSync('isRegistered', true);
    
    this.setData({
      isRegistered: true,
      showRegister: false,
      phoneNumber: phoneNumber
    });

    // 注册成功后进行手机号验证和跳转
    this.handleLoginSuccess(phoneNumber);
  },

  // 修改获取手机号方法
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
      
      // 获取手机号成功后进行验证和跳转
      this.handleLoginSuccess(phoneNumber);
    }
  },

  // 修改手动注册方法
  handleManualRegister() {
    const { manualPhoneNumber, verificationCode } = this.data;
    
    if (!/^1[3-9]\d{9}$/.test(manualPhoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none'
      });
      return;
    }

    // 手动注册成功后进行验证和跳转
    this.register(manualPhoneNumber);
  }

  // 保持其他原有方法...
});