Page({
  data: {
    imageUrl: '',
    imageInfo: null,
    travelSuggestions: [],
    isAnalyzing: false,
    recognizedDate: '',
    recognizedLocation: '',
    transportationOptions: [],
    // 新增图片内容相关数据
    imageContent: {
      landmarks: [], // 地标建筑
      scenery: [], // 自然景观
      activities: [], // 可能的活动
      season: '', // 季节特征
      timeOfDay: '', // 时间段
      weather: '' // 天气状况
    },
    showImageAnalysis: false
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
      // 分析图片内容
      this.analyzeImageContent(filePath);
      
      // 保持原有的位置和日期识别代码...
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

  // 分析图片内容
  analyzeImageContent(filePath) {
    this.setData({ isAnalyzing: true });

    // TODO: 调用图片内容识别API
    setTimeout(() => {
      const mockImageContent = {
        landmarks: ['西湖', '雷峰塔', '断桥'],
        scenery: ['湖泊', '山峦', '园林'],
        activities: ['游船', '散步', '摄影'],
        season: '春季',
        timeOfDay: '下午',
        weather: '晴朗'
      };

      this.setData({
        imageContent: mockImageContent,
        showImageAnalysis: true,
        isAnalyzing: false
      });

      // 根据识别内容生成建议
      this.generateContentBasedSuggestions(mockImageContent);
    }, 2000);
  },

  // 根据图片内容生成建议
  generateContentBasedSuggestions(content) {
    const suggestions = [
      `这是在${content.landmarks.join('、')}附近拍摄的照片`,
      `照片显示这是${content.season}${content.timeOfDay}的景色，天气${content.weather}`,
      `建议可以体验${content.activities.join('、')}等活动`
    ];

    this.setData({
      travelSuggestions: suggestions
    });

    // 请求AI分析
    this.requestAiAnalysis();
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