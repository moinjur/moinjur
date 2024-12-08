const app = getApp();
const amapFile = require('../../libs/amap-wx.js'); // 引入高德地图SDK
const myAmapFun = new amapFile.AMapWX({
  key: 'your_amap_key' // 替换为您的高德地图key
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
    includePoints: []
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
            id: index + 2, // id从2开始，因为1已经用于当前位置
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