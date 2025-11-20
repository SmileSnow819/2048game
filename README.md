# 2048 Game - React + TypeScript

一个使用 React + TypeScript + Vite 构建的 2048 游戏。
**访问地址：** https://smilesnow819.github.io/2048game/

## 功能特性

- 🎮 经典的 2048 游戏玩法
- ⚡ 使用 React 19 + TypeScript 开发
- 🎨 流畅的动画效果 (Framer Motion)
- 📱 响应式设计
- 🚀 基于 Vite 构建

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 部署

### GitHub Pages 自动部署

项目已配置 GitHub Actions 工作流，当代码推送到 `main` 分支时会自动构建并部署到 GitHub Pages。


### 部署流程

1. 推送代码到 `main` 分支
2. GitHub Actions 自动触发构建流程
3. 构建成功后自动部署到 GitHub Pages

详细部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 技术栈

- **前端框架**: React 19
- **开发语言**: TypeScript
- **构建工具**: Vite
- **动画库**: Framer Motion
- **代码规范**: ESLint

## 项目结构

```
src/
├── components/     # React 组件
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
├── types/         # TypeScript 类型定义
└── constants/     # 常量定义
```

## 许可证

MIT License
