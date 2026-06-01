# Museum Tracker

记录你去过的所有博物馆 🏛️

## 使用方式

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 添加博物馆访问记录
npm run add

# 抓取博物馆信息
npm run fetch
```

## 工作流

1. `npm run add` — 交互式输入博物馆名称和访问日期
2. `npm run fetch` — 自动从维基百科抓取博物馆信息（照片、介绍）
3. 提交数据变更到 GitHub → 自动部署到 GitHub Pages

## 技术栈

- React 18 + TypeScript
- Vite
- CSS Modules
- 维基百科 API
- GitHub Pages
