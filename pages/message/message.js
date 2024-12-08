Page({
  data: {
    currentTab: 0,
    tabs: ['赞', '关注', '收藏', '通知'],
    messages: {
      likes: [],
      follows: [],
      collections: [],
      notifications: []
    }
  },

  onLoad() {
    this.loadMessages();
  },

  // 切换标签
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
  },

  // 加载消息
  loadMessages() {
    // TODO: 从服务器获取消息数据
    const mockMessages = {
      likes: [
        {
          id: 1,
          user: {
            id: 1,
            name: '用户A',
            avatar: '/images/avatar.png'
          },
          content: '赞了你的笔记',
          time: '2小时前',
          type: 'like'
        }
      ],
      follows: [
        {
          id: 2,
          user: {
            id: 2,
            name: '用户B',
            avatar: '/images/avatar.png'
          },
          content: '关注了你',
          time: '3小时前',
          type: 'follow'
        }
      ],
      collections: [
        {
          id: 3,
          user: {
            id: 3,
            name: '用户C',
            avatar: '/images/avatar.png'
          },
          content: '收藏了你的笔记',
          time: '4小时前',
          type: 'collection'
        }
      ],
      notifications: [
        {
          id: 4,
          title: '系统通知',
          content: '欢迎使用小程序',
          time: '1天前',
          type: 'system'
        }
      ]
    };

    this.setData({
      messages: mockMessages
    });
  },

  // 查看消息详情
  viewDetail(e) {
    const {type, id} = e.currentTarget.dataset;
    // TODO: 根据消息类型跳转到相应页面
    console.log('查看消息详情:', type, id);
  },

  // 标记消息为已读
  markAsRead(e) {
    const {type, id} = e.currentTarget.dataset;
    // TODO: 调用接口标记消息为已读
    console.log('标记消息为已读:', type, id);
  }
});