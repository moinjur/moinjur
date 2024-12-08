const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    stats: {
      followers: 0,
      following: 0,
      likes: 0,
      collections: 0
    },
    footprints: [],
    notes: []
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      });
      this.loadUserStats();
    }
  },

  // 加载用户统计数据
  loadUserStats() {
    // TODO: 从服务器获取数据
    this.setData({
      stats: {
        followers: 128,
        following: 256,
        likes: 1024,
        collections: 64
      }
    });
  },

  // 编辑资料
  editProfile() {
    wx.navigateTo({
      url: '/pages/profile/edit/edit'
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: `${this.data.userInfo.nickName}的个人主页`,
      path: '/pages/profile/profile?id=' + this.data.userInfo.id
    };
  },

  // 查看笔记
  viewNotes() {
    wx.navigateTo({
      url: '/pages/profile/notes/notes'
    });
  },

  // 查看足迹
  viewFootprints() {
    wx.navigateTo({
      url: '/pages/profile/footprints/footprints'
    });
  },

  // 查看粉丝
  viewFollowers() {
    wx.navigateTo({
      url: '/pages/profile/followers/followers'
    });
  },

  // 查看关注
  viewFollowing() {
    wx.navigateTo({
      url: '/pages/profile/following/following'
    });
  },

  // 登录
  login() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        wx.setStorageSync('userInfo', res.userInfo);
        this.loadUserStats();
      }
    });
  }
});