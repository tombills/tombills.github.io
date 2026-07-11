# 个人网站（静态 · GitHub Pages）

一套零构建、纯静态的个人网站模板，包含：首页 / 关于（简历式）/ 经历 / 项目作品集 / 博客 / 联系。
技术栈：原生 HTML + CSS + 一小段原生 JS，无任何依赖、无打包步骤，推上 GitHub 即可上线。

## 目录结构

```
.
├── index.html            # 主站（单页，含全部板块）
├── assets/
│   ├── css/style.css     # 全部样式（改色只动 :root 变量）
│   └── js/main.js        # 移动端菜单 / 滚动动画 / 导航高亮
├── blog/
│   ├── index.html        # 博客列表
│   ├── post-1.html       # 示例文章一
│   └── post-2.html       # 示例文章二
├── .nojekyll             # 告诉 GitHub 不要用 Jekyll 处理
└── README.md
```

## 本地预览

直接双击 `index.html` 即可。或起一个本地服务器（推荐，避免个别浏览器限制）：

```bash
# Python
python3 -m http.server 8000
# 然后打开 http://localhost:8000
```

## 部署到 GitHub Pages

1. **建仓库**
   - 推荐仓库名 `你的用户名.github.io`，这样网站会直接出现在 `https://你的用户名.github.io`。
   - 普通仓库名也可以，访问地址会是 `https://你的用户名.github.io/仓库名`。

2. **推代码**
   ```bash
   git init
   git add .
   git commit -m "initial personal site"
   git branch -M main
   git remote add origin git@github.com:你的用户名/仓库名.git
   git push -u origin main
   ```

3. **开启 Pages**
   - 进入仓库 → **Settings → Pages**
   - Source 选择 **Deploy from a branch**
   - Branch 选 **main**，**目录选 `/ (root)`**
   - 保存后等待 1–2 分钟，访问上面的地址即可。

4. **（可选）自定义域名**
   - 在 Pages 设置里填写你的域名，并按提示添加一条 `CNAME` 解析（指向 `你的用户名.github.io`）。
   - 自定义域名下建议开启 **Enforce HTTPS**。

## 怎么改成你自己的

- **文字 / 链接**：直接编辑 `index.html` 和 `blog/*.html` 里带「★ 替换」注释或明显占位的内容。
- **配色**：打开 `assets/css/style.css`，只改 `:root` 里的变量（`--accent` 是主题色）。
- **加文章**：复制 `blog/post-1.html` 改成新文件，并在 `blog/index.html` 和 `index.html` 的博客板块补一条链接。
- **加项目**：复制 `index.html` 里任意一个 `<article class="card">` 块。

> 所有内容都用占位文字（「你的名字」「项目名称一」等）标注，搜索替换即可。
