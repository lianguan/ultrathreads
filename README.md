# UltraThreads - 在线学习平台

UltraThreads 是一个在线学习管理系统（LMS），包含后端 API 和前端 Web 应用。

## 技术栈

- **后端**: Go + Gin + GORM + MySQL
- **前端**: Next.js 15 + React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **数据库**: MySQL 8.0+ / MariaDB 10.5+

## 系统要求

- **Go**: 1.21+
- **Node.js**: 18+
- **MySQL**: 8.0+ 或 MariaDB 10.5+

## 快速开始

### 1. 克隆项目

```bash
git clone <repo-url>
cd ultrathreads
```

### 2. 配置环境变量

复制环境变量模板并编辑：

```bash
cp api/.env.example api/.env
```

编辑 `api/.env`，配置数据库连接等信息：

```env
# 数据库
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DBNAME=course

# 认证
PASSWORD_SALT=
JWT_SIGNING_KEY=your-jwt-signing-key

# 服务端口
HTTP_PORT=8000
```

> 注意：`PASSWORD_SALT` 需与初始化数据中的密码哈希方式一致。`init.sql` 中的密码使用空盐值。

### 3. 初始化数据库

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS course CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p course < api/init.sql
```

### 4. 启动后端

```bash
cd api
go mod download
go run main.go
```

后端默认运行在 `http://localhost:8000`。

### 5. 启动前端

```bash
cd web
npm install
npm run dev
```

前端默认运行在 `http://localhost:3000`。

### 6. 构建生产版本

**后端：**

```bash
cd api
go build -o ../app main.go
```

**前端：**

```bash
cd web
npm run build
npm start
```

## 访问地址

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:3000 |
| 后端 API | http://localhost:8000 |
| API 文档 (Swagger) | http://localhost:8000/swagger/index.html |

## 测试账号

所有账号密码统一为 `admin`（空盐值 SHA1 哈希）。

### 管理员

| 邮箱 | 密码 | 所属学校 |
|------|------|----------|
| admin@admin.com | admin | UltraThreads Academy |
| zhang@ultrathreads.me | admin | UltraThreads Academy |
| li@designschool.me | admin | Creative Design School |

### 学生

| 邮箱 | 密码 | 所属学校 |
|------|------|----------|
| student1@example.com | admin | UltraThreads Academy |
| student2@example.com | admin | UltraThreads Academy |
| student3@example.com | admin | UltraThreads Academy |
| student5@designschool.me | admin | Creative Design School |

### 普通用户

| 邮箱 | 密码 |
|------|------|
| xiaoming@example.com | admin |
| xiaohong@example.com | admin |

## 项目结构

```
ultrathreads/
├── api/                    # 后端
│   ├── internal/          # 内部业务逻辑
│   │   ├── config/        # 配置加载
│   │   ├── delivery/      # HTTP 接口层
│   │   ├── domain/        # 领域模型
│   │   ├── repository/    # 数据访问层
│   │   └── service/       # 业务服务层
│   ├── pkg/               # 公共工具包
│   ├── templates/         # 邮件模板
│   ├── init.sql           # 数据库初始化脚本
│   ├── .env               # 环境变量配置
│   ├── .env.example       # 环境变量模板
│   └── main.go            # 入口文件
├── web/                   # 前端 (Next.js)
│   ├── src/
│   │   ├── app/           # 页面路由
│   │   ├── components/    # 组件
│   │   └── lib/           # 工具库
│   └── package.json
└── README.md
```

## 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `APP_ENV` | 运行环境 (local/prod) | local |
| `HTTP_PORT` | 后端端口 | 8000 |
| `MYSQL_HOST` | 数据库地址 | localhost |
| `MYSQL_PORT` | 数据库端口 | 3306 |
| `MYSQL_USER` | 数据库用户 | root |
| `MYSQL_PASSWORD` | 数据库密码 | - |
| `MYSQL_DBNAME` | 数据库名 | course |
| `PASSWORD_SALT` | 密码盐值 | - |
| `JWT_SIGNING_KEY` | JWT 签名密钥 | - |
| `ACCESS_TOKEN_TTL` | Access Token 有效期 | 2h |
| `REFRESH_TOKEN_TTL` | Refresh Token 有效期 | 720h |
| `CACHE_TTL` | 缓存过期时间 | 60s |
| `STORAGE_ENDPOINT` | 文件存储端点 | - |
| `STORAGE_BUCKET` | 文件存储桶 | - |
| `STORAGE_ACCESS_KEY` | 存储访问密钥 | - |
| `STORAGE_SECRET_KEY` | 存储密钥 | - |
| `SMTP_HOST` | 邮件服务器 | - |
| `SMTP_PORT` | 邮件端口 | 587 |
| `SMTP_FROM` | 发件人地址 | - |
| `SMTP_PASSWORD` | 邮件密码 | - |

## 常见问题

### MySQL 连接失败

- 确认 MySQL 服务已启动
- 检查 `.env` 中的数据库配置
- 确认数据库用户有足够权限

### 端口被占用

修改 `.env` 中的 `HTTP_PORT` 或 `web/next.config.ts` 中的端口。

### Go 依赖下载慢

```bash
go env -w GOPROXY=https://goproxy.cn,direct
```

### npm 安装慢

```bash
npm config set registry https://registry.npmmirror.com
```
