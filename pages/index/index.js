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
    // 新增注册相关数据
    showRegister: true,
    registerType: '', // 'wechat' 或 'manual'
    manualPhoneNumber: '',
    verificationCode: '',
    showVerificationInput: false,
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
    // 保持原有代码...
    
    // 检查是否已注册
    const isRegistered = wx.getStorageSync('isRegistered');
    if (isRegistered) {
      this.setData({
        isRegistered: true,
        showRegister: false
      });
    }
  },

  // 选择注册方式
  chooseRegisterType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ registerType: type });
    
    if (type === 'wechat') {
      this.handleUserProfile();
    }
  },

  // 处理手动输入手机号
  handlePhoneInput(e) {
    this.setData({
      manualPhoneNumber: e.detail.value
    });
  },

  // 发送验证码
  sendVerificationCode() {
    const phoneNumber = this.data.manualPhoneNumber;
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    // TODO: 调用发送验证码接口
    wx.showToast({
      title: '验证码已发送',
      icon: 'success'
    });

    this.setData({
      showVerificationInput: true
    });
  },

  // 处理验证码输入
  handleVerificationInput(e) {
    this.setData({
      verificationCode: e.detail.value
    });
  },

  // 手动注册
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

    // TODO: 调用注册接口
    this.register(manualPhoneNumber);
  },

  // 保持原有方法并扩展...
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

        // 获取微信手机号
        this.showGetPhoneNumber();
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

  register(phoneNumber) {
    // TODO: 实现注册逻辑
    console.log('注册用户，手机号：', phoneNumber);
    
    // 保存注册状态
    wx.setStorageSync('isRegistered', true);
    
    this.setData({
      isRegistered: true,
      showRegister: false,
      phoneNumber: phoneNumber
    });

    wx.showToast({
      title: '注册成功',
      icon: 'success'
    });
  }

  // 保持其他原有方法...
});