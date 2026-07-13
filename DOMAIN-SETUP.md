# 绑定自有域名 siyu.dpdns.org 到 GitHub Pages（Cloudflare 托管）

> 域名：`siyu.dpdns.org`（DigitalPlat FreeDomain 免费二级域名，支持 Cloudflare 托管）
> 目标：根域名 `siyu.dpdns.org` 和 `www.siyu.dpdns.org` 都能访问，且启用 HTTPS
> GitHub 仓库：`tombills.github.io`

---

## ⚠️ 最重要：操作时序（务必照此顺序）

**先配 DNS 并确认生效，最后才 push CNAME 文件。**
如果先 push CNAME（内容已是 siyu.dpdns.org），但 DNS 还没指向 GitHub，
`tombills.github.io` 会被强制跳转到 DNS 未生效的 `siyu.dpdns.org` → 原域名又打不开。

正确顺序：A（Cloudflare 加站点）→ B（DigitalPlat 改 NS）→ C（Cloudflare 加记录）
→ D（验证 DNS 生效）→ E（GitHub 填域名 + 开 HTTPS）→ **最后** F（push CNAME）。

---

## A. Cloudflare 添加站点

1. 登录 Cloudflare，点 **Add a Site**，输入 `siyu.dpdns.org`（输入完整子域名，不要只填 dpdns.org）。
2. 选 **Free** 计划 → Continue。
3. 跳过 DNS 扫描（可能为空）。
4. Cloudflare 会给出两个 Nameserver，例如：
   ```
   nora.ns.cloudflare.com
   rick.ns.cloudflare.com
   ```
   **记下这两个 NS**，下一步要用。

## B. DigitalPlat 后台改 NS（关键一步）

1. 登录 DigitalPlat FreeDomain 控制台：`https://dash.domain.digitalplat.org`
2. 进入域名 `siyu.dpdns.org` 的管理页 → DNS / Nameserver 设置。
3. 把原来的 nameserver 删掉，改成 Cloudflare 给的那两个 NS，保存。
4. （dpdns.org 是 PSL 列表内域名，支持自定义 NS，这一步可行。）

## C. Cloudflare 加 DNS 记录

等 B 步 NS 生效（通常几分钟～几小时，DigitalPlat 生效较快）。

1. Cloudflare → `siyu.dpdns.org` → **DNS → Records → Add record**，加两条：

| 类型 | Name | Target | 代理状态 | TTL |
|------|------|--------|---------|-----|
| CNAME | `@` | `tombills.github.io` | **DNS only（灰云）** | Auto |
| CNAME | `www` | `tombills.github.io` | **DNS only（灰云）** | Auto |

> ⚠️ 代理先点成灰色云朵「DNS only」，不要橙色（橙色 proxied 会和 GitHub HTTPS 证书冲突/重定向循环）。加速留到最后再做。

## D. 验证 DNS 生效（本地命令行）

```bash
nslookup siyu.dpdns.org
# 或
dig siyu.dpdns.org
```

应能看到解析到 GitHub 的 IP（185.199.x.x）或 CNAME 指向 `tombills.github.io`。
看到正确结果，说明 DNS 已生效，可进入下一步。

## E. GitHub 填自定义域名 + 开 HTTPS

1. 进入仓库 `tombills.github.io` → **Settings → Pages**。
2. **Custom domain** 填 `siyu.dpdns.org` → Save。
3. 页面下方会出现 DNS check 状态，等它变成绿色 ✅（10～30 分钟，取决于 TTL）。
4. 变绿后，勾选 **Enforce HTTPS**，等 GitHub 自动签发免费证书（几分钟～几小时）。

> GitHub 会自动把 `www.siyu.dpdns.org` 重定向到根域名 `siyu.dpdns.org`，所以只要 CNAME 填根域名即可。

## F. 最后：push CNAME 文件（已改好，等现在才推）

确认 D、E 都完成后，在本地仓库目录执行：

```bash
git add CNAME
git commit -m "chore: 绑定自定义域名 siyu.dpdns.org"
git push
```

push 后 GitHub Pages 检测到 CNAME，把 `tombills.github.io` 重定向到 `siyu.dpdns.org`，
而此时 `siyu.dpdns.org` 已能解析并启用 HTTPS → 无缝切换。

## G.（可选）启用 Cloudflare CDN 加速

确认 `https://siyu.dpdns.org` 已能正常 HTTPS 访问后：

1. Cloudflare → **SSL/TLS** → 模式设为 **Full**（严禁 Flexible，会无限重定向）。
2. 把 C、D 步那两条记录的云朵点成 **橙色（Proxied）**。

之后流量走 Cloudflare 加速；不想折腾就一直留灰云也完全没问题。

---

## 排错速查

| 现象 | 原因 | 处理 |
|------|------|------|
| `tombills.github.io` 跳到打不开的页 | CNAME 已推但 DNS 没配 | 先完成 A~E，最后再 push CNAME |
| GitHub Pages DNS check 一直红 | NS 还没生效 / 记录填错 | 确认 B 步 NS 已改、C 步 Target 拼写正确，等久一点 |
| 访问提示证书/重定向循环 | Cloudflare 开了 proxied 但 SSL 模式是 Flexible | 关 proxied（灰云）或把 SSL 模式改成 Full |
| `www` 打不开 | `www` 那条 CNAME 漏加 | 补 C 步的 www 记录 |
