Page({
  data: {
    imageUrl: '',
    imageInfo: null,
    travelSuggestions: [],
    isAnalyzing: false,
    recognizedDate: '',
    recognizedLocation: '',
    transportationOptions: []
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
      // 模拟识别结果
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
          isAnalyzing: false
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