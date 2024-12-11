const app = getApp();
const amapFile = require('../../libs/amap-wx.js');
const myAmapFun = new amapFile({
  key: '752271e90ac3f23aad7fc1fb64e27a7c'
});

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    showPhoneAuth: false,
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
    scale: 14,
    // 高德地图3D配置
    showScale: true,
    showCompass: true,
    enable3D: true,
    showBuildingBlock: true,
    skew: 40,
    rotate: 0,
    mapStyle: 'amap://styles/dark'
  },

  onLoad() {
    // 检查是否需要显示手机号授权
    if (app.globalData.showPhoneAuth) {
      this.setData({
        showPhoneAuth: true
      });
    }

    // 监听手机号授权状态
    app.showPhoneAuthCallback = () => {
      this.setData({
        showPhoneAuth: true
      });
    }

    // 监听位置授权状态
    app.locationAuthCallback = () => {
      this.getLocation();
    }

    // 如果已有位置权限，直接获取位置
    if (app.globalData.hasLocationAuth) {
      this.getLocation();
    }
  },

  // 处理手机号授权
  handlePhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const phoneNumber = e.detail.phoneNumber;
      app.globalData.phoneNumber = phoneNumber;
      
      // 保存到云数据库
      app.saveUserInfo(phoneNumber);
      
      this.setData({
        showPhoneAuth: false
      });

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