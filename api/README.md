# UltraThreads LMS Backend

UltraThreads 是一个在线学习管理系统（LMS）的后端服务，提供课程管理、学生管理、订单支付、文件上传等完整功能。

## 技术栈

- **语言**: Go 1.17
- **Web 框架**: Gin
- **数据库**: MySQL 8.0 + GORM
- **对象存储**: MinIO (S3 兼容)
- **认证**: JWT (Access Token + Refresh Token)
- **邮件**: SMTP + SendPulse
- **支付**: Fondy
- **API 文档**: Swagger
- **部署**: Docker + Nginx

## 项目结构

```
├── main.go                 # 应用入口
├── init.sql                # 数据库初始化脚本
├── configs/                # 配置文件
├── internal/
│   ├── app/                # 应用启动与依赖注入
│   ├── config/             # 配置加载
│   ├── delivery/http/v1/   # HTTP 路由与处理器
│   ├── domain/             # 领域模型
│   ├── repository/         # 数据访问层 (MySQL)
│   ├── server/             # HTTP 服务器
│   └── service/            # 业务逻辑层
├── pkg/                    # 公共工具包
│   ├── auth/               # JWT 认证管理
│   ├── cache/              # 内存缓存
│   ├── database/mysql/     # MySQL 客户端
│   ├── email/              # 邮件发送 (SMTP/SendPulse)
│   ├── hash/               # 密码哈希
│   ├── limiter/            # 请求限流
│   ├── otp/                # 一次性验证码
│   ├── payment/            # 支付集成 (Fondy)
│   └── storage/            # 文件存储 (MinIO)
├── templates/              # 邮件模板
├── deploy/                 # 部署配置
└── docs/                   # Swagger 文档
```

## 核心功能

- **学校管理** - 多租户支持，每个学校独立配置
- **课程管理** - 课程、模块、课时、套餐的创建与管理
- **学生管理** - 注册、验证、课程分配、封禁
- **管理员** - 学校管理员账户管理
- **订单与支付** - 优惠码、订单创建、Fondy 支付回调
- **文件上传** - 图片/视频上传至对象存储
- **问卷调查** - 模块学习后的调查问卷
- **邮件通知** - 注册验证、购买成功通知

## 快速开始

### 前置条件

- Go 1.17+
- Docker & Docker Compose
- MySQL 8.0

### 本地运行

1. 初始化数据库：

```bash
mysql -u root -proot1234 course < init.sql
```

2. 创建 `.env` 文件：

```dotenv
APP_ENV=local

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root1234
MYSQL_DATABASE=course

PASSWORD_SALT=<random string>
JWT_SIGNING_KEY=<random string>

HTTP_HOST=localhost

SMTP_PASSWORD=<password>

STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

3. 构建并运行：

```bash
make run
```

服务启动后访问 `http://localhost:8000/api/v1/`

### 常用命令

```bash
make run          # 构建并运行
make build        # 仅构建
make test         # 运行单元测试
make test.integration  # 运行集成测试
make lint         # 代码检查
make swag         # 重新生成 Swagger 文档
make gen          # 生成 mock 文件
```

## API 文档

启动服务后访问 Swagger UI：`http://localhost:8000/swagger/index.html`

## 部署

使用 Docker Compose 部署：

```bash
cd deploy
docker-compose up -d
```
