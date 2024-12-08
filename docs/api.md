# API接口文档

## 1. 接口规范

### 1.1 请求格式
- 基础URL: `https://api.example.com/v1`
- 请求方法: GET, POST, PUT, DELETE
- Content-Type: application/json
- 字符编码: UTF-8

### 1.2 响应格式
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 1.3 错误码
- 0: 成功
- 1001: 参数错误
- 1002: 未授权
- 1003: 服务器错误
- 1004: 资源不存在

## 2. 用户接口

### 2.1 用户登录
```
POST /user/login
```

请求参数：
```json
{
  "code": "string",
  "userInfo": {
    "nickName": "string",
    "avatarUrl": "string",
    "gender": 1
  }
}
```

响应示例：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "string",
    "userId": "string"
  }
}
```

### 2.2 获取用户信息
```
GET /user/info
```

请求头：
```
Authorization: Bearer <token>
```

响应示例：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "userId": "string",
    "nickName": "string",
    "avatarUrl": "string",
    "gender": 1,
    "phoneNumber": "string"
  }
}
```

## 3. 旅行接口

### 3.1 获取目的地推荐
```
GET /travel/destinations
```

请求参数：
```
page: number
size: number
```

响应示例：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "list": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "imageUrl": "string"
      }
    ]
  }
}
```

### 3.2 创建行程计划
```
POST /travel/plan
```

请求参数：
```json
{
  "destination": "string",
  "startDate": "2024-01-01",
  "endDate": "2024-01-07",
  "activities": [
    {
      "date": "2024-01-01",
      "places": ["string"]
    }
  ]
}
```

## 4. 养生打卡接口

### 4.1 提交打卡记录
```
POST /checkin/record
```

请求参数：
```json
{
  "date": "2024-01-01",
  "tasks": [
    {
      "taskId": "string",
      "status": "completed"
    }
  ]
}
```

### 4.2 获取打卡统计
```
GET /checkin/stats
```

响应示例：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalDays": 30,
    "continuousDays": 7,
    "monthlyStats": {
      "total": 20,
      "completed": 15
    }
  }
}
```

## 5. 学习中心接口

### 5.1 获取课程列表
```
GET /learn/courses
```

### 5.2 获取课程详情
```
GET /learn/courses/:id
```

### 5.3 提交学习进度
```
POST /learn/progress
```

## 6. 通用接口

### 6.1 上传文件
```
POST /common/upload
```

### 6.2 获取配置信息
```
GET /common/config
```

## 7. 安全规范

### 7.1 接口认证
- 所有接口必须携带token
- token有效期为7天
- token失效需要重新登录

### 7.2 请求限制
- 单个IP每分钟最多100次请求
- 单个用户每分钟最多50次请求
- 上传文件大小限制为10MB

### 7.3 数据加密
- 敏感信息传输使用HTTPS
- 密码等敏感数据使用SHA256加密
- 重要参数需要签名验证

## 8. 开发规范

### 8.1 版本控制
- 使用语义化版本号
- API版本号在URL中体现
- 重大变更需要向下兼容

### 8.2 文档维护
- 接口变更及时更新文档
- 标注接口废弃信息
- 提供接口变更历史