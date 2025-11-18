# GitHub Pages 部署说明

## 自动部署

本项目已配置 GitHub Actions 工作流，当代码推送到 `main` 分支时会自动构建并部署到 GitHub Pages。

### 部署流程

1. 推送代码到 `main` 分支
2. GitHub Actions 自动触发构建流程
3. 构建成功后自动部署到 GitHub Pages

### 访问地址

部署成功后，可以通过以下地址访问：

```
https://smilesnow819.github.io/2048game/
```

## 手动部署

如果需要手动触发部署，可以在 GitHub 仓库的 Actions 页面手动运行工作流：

1. 进入仓库的 Actions 页面
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 "Run workflow" 按钮

## 本地构建测试

在部署前，可以在本地测试构建：

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 注意事项

- 确保 `vite.config.ts` 中的 `base` 配置为 `'/2048game/'`（仓库名称）
- 构建产物会输出到 `dist` 目录
- GitHub Pages 会自动从 `gh-pages` 分支或构建产物提供服务

## 故障排除

如果部署失败，请检查：

1. GitHub Actions 工作流日志
2. 构建是否成功完成
3. 仓库设置中是否启用了 GitHub Pages
4. GitHub Pages 源是否设置为 "GitHub Actions"
