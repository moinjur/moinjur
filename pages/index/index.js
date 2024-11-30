const app = getApp();

Page({
  data: {
    // 保持原有数据...
    showRemoveAccountDialog: false
  },

  // 显示移除账号对话框
  showRemoveAccount() {
    this.setData({
      showRemoveAccountDialog: true
    });
  },

  // 取消移除账号
  cancelRemoveAccount() {
    this.setData({
      showRemoveAccountDialog: false
    });
  },

  // 确认移除账号
  async confirmRemoveAccount() {
    try {
      // 清理本地存储
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('isRegistered');
      wx.removeStorageSync('hasLoggedIn');
      wx.removeStorageSync('isPhoneVerified');
      wx.removeStorageSync('lastLocation');

      // 重置全局数据
      app.globalData.userInfo = null;
      app.globalData.phoneNumber = null;
      app.globalData.isRegistered = false;

      // 重置页面数据
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
  },

  // 保持原有方法...
});