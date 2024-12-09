const app = getApp();
// 修改引入路径
const amapFile = require('../../libs/amap-wx.js');
const myAmapFun = new amapFile({
  key: '752271e90ac3f23aad7fc1fb64e27a7c'
});

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
    scale: 14,
    polyline: [],
    circles: [],
    controls: [],
    includePoints: [],
    isLoading: false,
    isRegistered: false,
    hasLocation: false
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }

    // 检查登录状态
    this.checkLoginStatus();

    // 检查定位权限
    this.checkLocationAuth();
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    const phoneNumber = wx.getStorageSync('phoneNumber');
    
    if (userInfo && phoneNumber) {
      this.setData({
        userInfo,
        hasUserInfo: true,
        isRegistered: true
      });
      app.globalData.userInfo = userInfo;
      app.globalData.phoneNumber = phoneNumber;
    }
  },

  // 检查定位权限
  checkLocationAuth() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.setData({ hasLocation: true });
              this.getLocation();
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
        } else {
          this.setData({ hasLocation: true });
          this.getLocation();
        }
      }
    });
  },

  // 获取位置信息
  getLocation() {
    if (!this.data.hasLocation) return;

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
            title: '当前位置',
            iconPath: '/images/marker.png',
            width: 32,
            height: 32
          }]
        });

        // 使用高德地图SDK获取周边信息
        this.getPoiAround(latitude, longitude);
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

  // 获取周边兴趣点
  getPoiAround(latitude, longitude) {
    myAmapFun.getPoiAround({
      location: `${longitude},${latitude}`,
      success: (data) => {
        if (data.markers) {
          const markers = data.markers.map((item, index) => ({
            id: index + 2,
            latitude: item.latitude,
            longitude: item.longitude,
            title: item.name,
            iconPath: '/images/poi.png',
            width: 24,
            height: 24
          }));

          this.setData({
            markers: [...this.data.markers, ...markers]
          });
        }
      },
      fail: (err) => {
        console.error('获取周边信息失败：', err);
      }
    });
  },

  // 处理用户信息
  handleUserProfile() {
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

  // 处理手机号
  handlePhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const phoneNumber = e.detail.phoneNumber;
      wx.setStorageSync('phoneNumber', phoneNumber);
      app.globalData.phoneNumber = phoneNumber;
      this.setData({ isRegistered: true });

      wx.showToast({
        title: '注册成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none'
      });
    }
  },

  // 地图相关事件处理
  onMarkerTap(e) {
    const markerId = e.markerId;
    const marker = this.data.markers.find(item => item.id === markerId);
    if (marker) {
      wx.showModal({
        title: marker.title,
        content: `位置：${marker.latitude}, ${marker.longitude}`,
        showCancel: false
      });
    }
  },

  onRegionChange(e) {
    console.log('region change', e);
  },

  onMapTap(e) {
    console.log('map tap', e);
  }
});