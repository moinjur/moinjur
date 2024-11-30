Page({
  data: {
    tasks: [
      {
        id: 1,
        name: '早起养生',
        description: '子时养生，顺应自然',
        isCompleted: false
      },
      {
        id: 2,
        name: '晨练',
        description: '太极或八段锦',
        isCompleted: false
      },
      {
        id: 3,
        name: '养生茶饮',
        description: '根据体质选择合适的茶饮',
        isCompleted: false
      }
    ],
    streak: 0,
    todayChecked: false
  },

  onLoad() {
    this.loadCheckInStatus();
  },

  loadCheckInStatus() {
    // TODO: 从服务器加载打卡状态
    const mockStreak = wx.getStorageSync('checkInStreak') || 0;
    const mockTodayChecked = wx.getStorageSync('todayChecked') || false;
    
    this.setData({
      streak: mockStreak,
      todayChecked: mockTodayChecked
    });
  },

  onTaskComplete(e) {
    const taskId = e.currentTarget.dataset.id;
    const tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });

    this.setData({ tasks });
  },

  onCheckIn() {
    if (this.data.todayChecked) {
      return;
    }

    const newStreak = this.data.streak + 1;
    
    this.setData({
      streak: newStreak,
      todayChecked: true
    });

    wx.setStorageSync('checkInStreak', newStreak);
    wx.setStorageSync('todayChecked', true);

    wx.showToast({
      title: '打卡成功！',
      icon: 'success'
    });
  }
});