Page({
  data: {
    imageUrl: '',
    imageInfo: null,
    travelSuggestions: [],
    isAnalyzing: false,
    recognizedDate: '',
    recognizedLocation: '',
    transportationOptions: [],
    // 新增数据
    inputText: '',
    showCustomize: false,
    customOptions: {
      budget: 'medium', // low, medium, high
      duration: 1, // 天数
      travelStyle: 'casual', // casual, intensive
      transportation: 'public' // public, private
    },
    budgetOptions: [
      { value: 'low', label: '经济' },
      { value: 'medium', label: '适中' },
      { value: 'high', label: '豪华' }
    ],
    styleOptions: [
      { value: 'casual', label: '轻松游览' },
      { value: 'intensive', label: '深度游览' }
    ],
    transportOptions: [
      { value: 'public', label: '公共交通' },
      { value: 'private', label: '私人交通' }
    ]
  },

  // 处理文字输入
  handleInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // 提交文字分析
  submitText() {
    if (!this.data.inputText.trim()) {
      wx.showToast({
        title: '请输入旅行需求',
        icon: 'none'
      });
      return;
    }

    this.setData({ isAnalyzing: true });
    this.analyzeText(this.data.inputText);
  },

  // 分析文字内容
  analyzeText(text) {
    // TODO: 调用文字分析API
    setTimeout(() => {
      const mockResult = {
        date: '2024-03-15',
        location: '杭州西湖',
        suggestions: [
          '根据您的描述，建议游览西湖景区',
          '可以体验本地特色美食',
          '建议选择公共交通'
        ],
        transportation: [
          {
            type: '地铁',
            route: '地铁1号线到龙翔桥站',
            duration: '约30分钟'
          },
          {
            type: '公交',
            route: '游5路到苏堤站',
            duration: '约45分钟'
          }
        ]
      };

      this.setData({
        imageInfo: mockResult,
        recognizedDate: mockResult.date,
        recognizedLocation: mockResult.location,
        travelSuggestions: mockResult.suggestions,
        transportationOptions: mockResult.transportation,
        isAnalyzing: false,
        showCustomize: true
      });
    }, 2000);
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          imageUrl: tempFilePath,
          isAnalyzing: true
        });
        this.analyzeImage(tempFilePath);
      }
    });
  },

  // 分析图片
  async analyzeImage(filePath) {
    try {
      // TODO: 调用图片识别API
      setTimeout(() => {
        const mockResult = {
          date: '2024-03-15',
          location: '杭州西湖',
          suggestions: [
            '春季游玩建议带伞',
            '建议选择公共交通',
            '景区人流量较大'
          ],
          transportation: [
            {
              type: '地铁',
              route: '地铁1号线到龙翔桥站',
              duration: '约30分钟'
            },
            {
              type: '公交',
              route: '游5路到苏堤站',
              duration: '约45分钟'
            }
          ]
        };

        this.setData({
          imageInfo: mockResult,
          recognizedDate: mockResult.date,
          recognizedLocation: mockResult.location,
          travelSuggestions: mockResult.suggestions,
          transportationOptions: mockResult.transportation,
          isAnalyzing: false,
          showCustomize: true
        });
      }, 2000);

    } catch (error) {
      console.error('图片分析失败：', error);
      wx.showToast({
        title: '图片分析失败',
        icon: 'none'
      });
      this.setData({ isAnalyzing: false });
    }
  },

  // 更新定制化选项
  updateCustomOption(e) {
    const { type } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    this.setData({
      [`customOptions.${type}`]: value
    });

    // 根据新的选项重新生成建议
    this.generateCustomizedPlan();
  },

  // 更新天数
  updateDuration(e) {
    this.setData({
      'customOptions.duration': parseInt(e.detail.value)
    });
    this.generateCustomizedPlan();
  },

  // 生成定制化方案
  generateCustomizedPlan() {
    const { budget, duration, travelStyle, transportation } = this.data.customOptions;
    
    // TODO: 根据选项调整建议
    const suggestions = [
      `根据您的${budget}预算，推荐以下行程`,
      `计划${duration}天的${travelStyle}行程`,
      `建议使用${transportation}方式出行`
    ];

    this.setData({
      travelSuggestions: suggestions
    });
  },

  // 查看交通详情
  viewTransportation(e) {
    const index = e.currentTarget.dataset.index;
    const option = this.data.transportationOptions[index];
    
    wx.showModal({
      title: option.type + '路线',
      content: `路线：${option.route}\n预计用时：${option.duration}`,
      showCancel: false
    });
  }
});