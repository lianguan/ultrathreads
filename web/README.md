# UltraThreads Web

UltraThreads 在线学习平台前端，基于 Next.js 15 + React 19 + shadcn/ui。

## 功能特性

- **管理员后台**：课程管理、模块管理、课时管理、学生管理、优惠码管理、订单管理、学校设置
- **学生端**：课程浏览、学习进度、订单管理、个人信息
- **公共页面**：课程列表、课程详情

## 技术栈

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui 组件库

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 项目结构

```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # 管理员后台页面
│   │   ├── (student)/         # 学生端页面
│   │   ├── (public)/          # 公共页面
│   │   └── (auth)/            # 认证页面
│   ├── components/
│   │   ├── ui/                # shadcn/ui 组件
│   │   └── layout/            # 布局组件
│   └── lib/
│       ├── api.ts             # API 客户端
│       ├── types.ts           # TypeScript 类型定义
│       ├── admin-auth.tsx     # 管理员认证上下文
│       └── student-auth.tsx   # 学生认证上下文
└── package.json
```

## API 配置

前端通过 Next.js rewrites 代理到后端 API：

```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: "/api/:path*",
      destination: "http://localhost:8000/api/:path*",
    },
  ];
}
```

确保后端服务运行在 `http://localhost:8000`。
