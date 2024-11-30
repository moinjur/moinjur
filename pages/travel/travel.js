Page({
  data: {
    // 保持原有数据...
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

  // 保持原有方法...

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

  // 修改原有的analyzeImage方法
  async analyzeImage(filePath) {
    try {
      // 分析图片内容
      this.analyzeImageContent(filePath);
      
      // 保持原有的位置和日期识别代码...
    } catch (error) {
      console.error('图片分析失败：', error);
      wx.showToast({
        title: '图片分析失败',
        icon: 'none'
      });
      this.setData({ isAnalyzing: false });
    }
  }
});