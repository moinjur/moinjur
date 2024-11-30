const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    isRegistered: false,
    phoneNumber: '',
    location: '',
    isLoading: false,
    isFirstLogin: true,
    isPhoneVerified: false,
    showRegister: true,
    showRemoveAccountDialog: false
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
  },

  // 保持原有的用户信息和登录相关方法...
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

  // 保持其他原有方法...
  showRemoveAccount() {
    this.setData({
      showRemoveAccountDialog: true
    });
  },

  cancelRemoveAccount() {
    this.setData({
      showRemoveAccountDialog: false
    });
  },

  async confirmRemoveAccount() {
    try {
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('isRegistered');
      wx.removeStorageSync('hasLoggedIn');
      wx.removeStorageSync('isPhoneVerified');

      app.globalData.userInfo = null;
      app.globalData.phoneNumber = null;
      app.globalData.isRegistered = false;

      this.setData({
        userInfo: {},
        hasUserInfo: false,
        isRegistered: false,
        phoneNumber: '',
        showRemoveAccountDialog: false,
        isFirstLogin: true,
        isPhoneVerified: false,
        showRegister: true
      });

      wx.showToast({
        title: '账号已移除',
        icon: 'success'
      });

    } catch (error) {
      console.error('移除账号失败：', error);
      wx.showToast({
        title: '移除账号失败',
        icon: 'none'
      });
    }
  }
});