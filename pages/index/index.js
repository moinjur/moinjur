const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
    scale: 14
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }

    // 获取位置信息
    this.getLocation();

    // 检查本地存储的用户信息
    const storedUserInfo = wx.getStorageSync('userInfo');
    if (storedUserInfo) {
      this.setData({
        userInfo: storedUserInfo,
        hasUserInfo: true
      });
      app.globalData.userInfo = storedUserInfo;
    }
  },

  // 获取位置信息
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const {latitude, longitude} = res;
        this.setData({
          latitude,
          longitude,
          markers: [{
            id: 1,
            latitude,
            longitude,
            title: '当前位置'
          }]
        });
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

  // 地图相关事件处理
  onMarkerTap(e) {
    console.log('marker tap', e);
  },

  onRegionChange(e) {
    console.log('region change', e);
  },

  onMapTap(e) {
    console.log('map tap', e);
  },

  // 保留原有的用户信息相关函数
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
  }
});