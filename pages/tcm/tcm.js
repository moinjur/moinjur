Page({
  data: {
    categories: [
      {
        id: 1,
        name: '四季养生',
        icon: '/assets/icons/seasons.png',
        articles: []
      },
      {
        id: 2,
        name: '饮食养生',
        icon: '/assets/icons/diet.png',
        articles: []
      },
      {
        id: 3,
        name: '经络养生',
        icon: '/assets/icons/meridian.png',
        articles: []
      }
    ],
    currentArticles: []
  },

  onLoad() {
    this.loadArticles(1); // 默认加载四季养生
  },

  loadArticles(categoryId) {
    // TODO: 从服务器加载文章
    const mockArticles = [
      {
        id: 1,
        title: '春季养生要点',
        summary: '春季养生重在养肝...',
        imageUrl: '/assets/images/spring.png'
      }
    ];
    
    this.setData({
      currentArticles: mockArticles
    });
  },

  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.loadArticles(categoryId);
  }
});