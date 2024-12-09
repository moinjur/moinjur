const app = getApp();
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
    hasLocation: false,
    // 3D地图相关配置
    skew: 40, // 倾斜角度
    rotate: 0, // 旋转角度
    showCompass: true, // 显示指南针
    enableOverlooking: true, // 开启俯视
    enableZoom: true, // 支持缩放
    enableRotate: true, // 支持旋转
    enableSatellite: true, // 支持卫星图
    enableBuilding: true, // 显示3D建筑物
    minScale: 3, // 最小缩放级别
    maxScale: 20, // 最大缩放级别
    layerStyle: 1, // 个性化地图样式
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

    // 初始化3D地图
    this.init3DMap();
  },

  // 初始化3D地图
  init3DMap() {
    // 设置地图3D效果
    this.mapCtx = wx.createMapContext('map');
    this.mapCtx.setBuildingColor({
      color: '#ffffff', // 建筑物主色
      strokeColor: '#ffffff', // 建筑物边框色
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

  // 保留原有的方法...
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

  // 其他原有方法保持不变...
});