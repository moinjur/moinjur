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
    scale: 14,
    polyline: [],
    circles: [],
    controls: [],
    includePoints: [],
    isLoading: false,
    isRegistered: false,
    hasLocation: false,
    // 3D地图相关配置
    skew: 40,
    rotate: 0,
    showCompass: true,
    enableOverlooking: true,
    enableZoom: true,
    enableRotate: true,
    enableSatellite: true,
    enableBuilding: true,
    minScale: 3,
    maxScale: 20,
    layerStyle: 1,
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }

    // 检查登录状态
    this.checkLoginStatus();

    // 获取位置信息
    this.getLocation();

    // 初始化3D地图
    this.init3DMap();
  },

  // 初始化3D地图
  init3DMap() {
    this.mapCtx = wx.createMapContext('map');
    this.mapCtx.setBuildingColor({
      color: '#ffffff',
      strokeColor: '#ffffff',
    });
  },

  // 处理地图旋转
  handleRotate() {
    let rotate = this.data.rotate;
    rotate = (rotate + 90) % 360;
    this.setData({ rotate });
  },

  // 处理地图倾斜
  handleSkew() {
    let skew = this.data.skew;
    skew = skew === 40 ? 0 : 40;
    this.setData({ skew });
  },

  // 切换卫星图
  toggleSatellite() {
    this.setData({
      enableSatellite: !this.data.enableSatellite
    });
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

  // 获取位置信息
  getLocation() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.setData({ hasLocation: true });
              this.requestLocation();
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
          this.requestLocation();
        }
      }
    });
  },

  // 请求位置信息
  requestLocation() {
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