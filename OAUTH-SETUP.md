# Decap CMS 登录授权配置（GitHub OAuth）

Decap CMS 编辑内容前，需要你用 GitHub 账号登录授权。因为 GitHub Pages 没有自带后端，
我们用一个 **Cloudflare Worker** 充当 OAuth 回调（你已有 `siyu.dpdns.org` 托管在 Cloudflare，正好用上）。

整个流程：
```
浏览器 /admin/  →  跳转 GitHub 授权  →  GitHub 回调 /callback（Cloudflare Worker）
→  Worker 用 code 换 token  →  重定向回 /admin/#/auth/callback?token=xxx  →  登录成功
```

---

## 第 1 步：在 GitHub 创建 OAuth App

1. 打开 https://github.com/settings/developers → **New OAuth App**
2. 填写：
   - **Application name**：`涛talk-site-cms`（随便起）
   - **Homepage URL**：`https://siyu.dpdns.org`
   - **Authorization callback URL**：`https://siyu.dpdns.org/callback`  ← 必须精确一致
3. 点 **Register application**
4. 记下生成的 **Client ID**
5. 点 **Generate a new client secret**，记下 **Client Secret**（只显示一次）

---

## 第 2 步：部署 Cloudflare Worker（OAuth 回调）

1. 登录 Cloudflare → 左侧 **Workers & Pages** → **Create** → **Create Worker**
2. Worker 名称填 `oauth-callback`，点 **Deploy**（先随便部署一版）
3. 进入该 Worker → **Edit code**，把全部代码替换为下面这段，再 **Save and Deploy**：

```js
const CLIENT_ID = '替换为第1步的Client ID';
const CLIENT_SECRET = '替换为第1步的Client Secret';
const SITE_URL = 'https://siyu.dpdns.org';

addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return new Response('Missing code parameter', { status: 400 });
  }
  const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code })
  });
  const token = await tokenResp.json();
  if (!token.access_token) {
    return new Response('Token exchange failed: ' + JSON.stringify(token), { status: 500 });
  }
  return Response.redirect(SITE_URL + '/admin/#/auth/callback?token=' + token.access_token, 302);
}
```

> ⚠️ 把代码里的 `CLIENT_ID` / `CLIENT_SECRET` 换成你自己的真实值。

---

## 第 3 步：让 /callback 走 Worker（关键）

Cloudflare 默认会把 `siyu.dpdns.org` 的所有请求转发到 GitHub Pages（你的网站）。
但 `/callback` 必须交给上面的 Worker 处理，不能转发。所以要加一条**路由规则**：

1. Cloudflare → 左侧 **Workers & Pages** → 进入 `oauth-callback` Worker
2. 选 **Triggers（触发器）** 标签 → **Add Route（添加路由）**
3. Route 填：`siyu.dpdns.org/callback*`  → 点 **Add route**
4. 确认其余路径（不填路由的）仍按 DNS 转发到 GitHub Pages

这样：
- `siyu.dpdns.org/` 和 `siyu.dpdns.org/admin/` → 网站（GitHub Pages）
- `siyu.dpdns.org/callback*` → Worker（OAuth 换 token）

---

## 第 4 步：使用后台

1. 浏览器打开 `https://siyu.dpdns.org/admin/`
2. 点 **Login with GitHub** → 授权
3. 左侧选「全站内容」或「观点文章」，可视化编辑，点 **Publish** 即保存
4. 保存后 Decap 会自动把改动 commit 回 GitHub 仓库，GitHub Pages 重新构建（约 1 分钟），刷新网站即更新

---

## 常见问题

- **登录后空白 / 报 callback 错误**：检查第1步的 callback URL 是否精确等于 `https://siyu.dpdns.org/callback`；检查第3步路由 `siyu.dpdns.org/callback*` 是否添加、且 Worker 代码里的 Client ID/Secret 是否正确。
- **/admin 打不开**：确认仓库里 `admin/index.html` 和 `admin/config.yml` 已 push，且 `siyu.dpdns.org` 已生效。
- **改了内容网站没变**：GitHub Pages 重建需要一点时间，等 1~2 分钟再强刷（Ctrl+F5）。
