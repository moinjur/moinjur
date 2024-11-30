Page({
  data: {
    // 保持原有数据...
    aiSuggestions: [], // AI建议列表
    showAiAnalysis: false, // 是否显示AI分析
    aiAnalyzing: false // AI分析中状态
  },

  // 保持原有方法...

  // 请求AI分析
  requestAiAnalysis() {
    this.setData({ 
      aiAnalyzing: true,
      showAiAnalysis: true 
    });

    // TODO: 调用AI分析API
    setTimeout(() => {
      const mockAiSuggestions = [
        {
          type: '行程优化',
          content: '根据您的预算和时间，建议将西湖游览安排在上午，可以避开人流高峰',
          confidence: 0.9
        },
        {
          type: '交通建议',
          content: '从您的位置到西湖景区，建议选择地铁1号线，可以节省30分钟路程',
          confidence: 0.85
        },
        {
          type: '天气提醒',
          content: '预计游玩当天有小雨，建议携带雨具，可以体验不一样的西湖美景',
          confidence: 0.95
        }
      ];

      this.setData({
        aiSuggestions: mockAiSuggestions,
        aiAnalyzing: false
      });
    }, 2000);
  },

  // 采纳AI建议
  adoptAiSuggestion(e) {
    const index = e.currentTarget.dataset.index;
    const suggestion = this.data.aiSuggestions[index];
    
    // 将AI建议整合到现有建议中
    const newSuggestions = [...this.data.travelSuggestions];
    newSuggestions.push(suggestion.content);
    
    this.setData({
      travelSuggestions: newSuggestions
    });

    wx.showToast({
      title: '已采纳建议',
      icon: 'success'
    });
  },

  // 分析图片时也请求AI建议
  async analyzeImage(filePath) {
    try {
      // 保持原有代码...
      this.requestAiAnalysis(); // 添加AI分析
    } catch (error) {
      console.error('图片分析失败：', error);
      wx.showToast({
        title: '图片分析失败',
        icon: 'none'
      });
      this.setData({ isAnalyzing: false });
    }
  },

  // 分析文字时也请求AI建议
  analyzeText(text) {
    // 保持原有代码...
    this.requestAiAnalysis(); // 添加AI分析
  }
});