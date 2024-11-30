Page({
  data: {
    courses: [
      {
        id: 1,
        title: '中医基础理论',
        lessons: 12,
        progress: 0,
        coverImage: '/assets/images/tcm-basic.png'
      },
      {
        id: 2,
        title: '经络穴位入门',
        lessons: 8,
        progress: 0,
        coverImage: '/assets/images/meridian-basic.png'
      },
      {
        id: 3,
        title: '四季养生方法',
        lessons: 10,
        progress: 0,
        coverImage: '/assets/images/season-health.png'
      }
    ],
    dailyTips: {
      title: '今日养生小知识',
      content: '春季养生重在养肝，可以多吃些绿色蔬菜...'
    }
  },

  onLoad() {
    this.loadProgress();
  },

  loadProgress() {
    // TODO: 从服务器加载学习进度
    const mockProgress = {
      1: 3,
      2: 2,
      3: 0
    };

    const courses = this.data.courses.map(course => ({
      ...course,
      progress: mockProgress[course.id] || 0
    }));

    this.setData({ courses });
  },

  onCourseTap(e) {
    const courseId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/learn/course/course?id=${courseId}`
    });
  }
});