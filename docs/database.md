# 数据库设计文档

## 1. 数据库概述

### 1.1 数据库选型
- 主数据库：MongoDB
- 缓存数据库：Redis
- 文件存储：腾讯云COS

### 1.2 设计原则
- 数据冗余适度
- 查询性能优先
- 数据一致性保证
- 适度拆分
- 合理索引

## 2. 集合设计

### 2.1 用户集合 (users)
```json
{
  "_id": ObjectId,
  "openId": String,
  "unionId": String,
  "nickName": String,
  "avatarUrl": String,
  "gender": Number,
  "phoneNumber": String,
  "registerTime": Date,
  "lastLoginTime": Date,
  "status": Number,
  "settings": {
    "notification": Boolean,
    "privacy": Object
  },
  "createdAt": Date,
  "updatedAt": Date
}
```

索引：
- openId: 唯一索引
- phoneNumber: 唯一索引
- lastLoginTime: 普通索引

### 2.2 旅行计划集合 (travel_plans)
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "destination": String,
  "startDate": Date,
  "endDate": Date,
  "status": String,
  "activities": [{
    "date": Date,
    "places": [String],
    "notes": String
  }],
  "weather": {
    "temperature": Number,
    "condition": String,
    "updated": Date
  },
  "createdAt": Date,
  "updatedAt": Date
}
```

索引：
- userId: 普通索引
- startDate: 普通索引
- destination: 普通索引

### 2.3 打卡记录集合 (checkins)
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "date": Date,
  "tasks": [{
    "taskId": ObjectId,
    "status": String,
    "completedAt": Date
  }],
  "streak": Number,
  "createdAt": Date,
  "updatedAt": Date
}
```

索引：
- userId_date: 复合唯一索引
- date: 普通索引

### 2.4 课程集合 (courses)
```json
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "cover": String,
  "lessons": [{
    "title": String,
    "duration": Number,
    "videoUrl": String,
    "content": String
  }],
  "category": String,
  "level": String,
  "status": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

索引：
- category: 普通索引
- status: 普通索引

### 2.5 学习进度集合 (learning_progress)
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "courseId": ObjectId,
  "progress": Number,
  "lastLesson": Number,
  "completedLessons": [Number],
  "createdAt": Date,
  "updatedAt": Date
}
```

索引：
- userId_courseId: 复合唯一索引

## 3. 缓存设计

### 3.1 缓存键设计
```
用户信息: user:{userId}
课程信息: course:{courseId}
打卡统计: checkin:stats:{userId}
配置信息: config:{key}
```

### 3.2 缓存策略
- 用户信息: 1小时
- 课程信息: 24小时
- 打卡统计: 5分钟
- 配置信息: 1小时

## 4. 数据迁移

### 4.1 迁移策略
- 增量迁移
- 分批处理
- 数据校验
- 回滚机制

### 4.2 迁移工具
- mongodump
- mongorestore
- 自定义迁移脚本

## 5. 数据备份

### 5.1 备份策略
- 每日全量备份
- 实时增量备份
- 多地备份
- 定期备份测试

### 5.2 备份内容
- 数据文件
- 配置文件
- 索引文件
- 日志文件

## 6. 监控告警

### 6.1 监控指标
- 连接数
- 查询性能
- 存储空间
- 索引使用
- 慢查询

### 6.2 告警规则
- 连接数超阈值
- 查询响应慢
- 磁盘空间不足
- 索引未命中

## 7. 安全措施

### 7.1 访问控制
- 角色权限
- IP白名单
- 加密传输
- 密码加密

### 7.2 审计日志
- 操作记录
- 访问日志
- 错误日志
- 性能日志

## 8. 扩展计划

### 8.1 分片策略
- 按用户ID分片
- 按时间分片
- 按地理位置分片

### 8.2 容量规划
- 数据增长预估
- 性能要求
- 存储容量
- 备份策略