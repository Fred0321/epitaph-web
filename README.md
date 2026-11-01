# 数字碑 · 静态演示（epitaph-web）

面向长辈与家人的数字墓志 / 生平纪念页演示。静穆、大字、米白与松绿配色。无后端，数据存在浏览器 `localStorage`。

设计参考：`ui/01_home.jpg` … `ui/05_preview.jpg`。

## 如何打开

1. 解压或进入本目录。
2. **直接双击** `index.html`（`file://` 即可，无需服务器）。
3. 或：

```bash
cd /workspace/epitaph-web
python3 -m http.server 8765
# 打开 http://127.0.0.1:8765/
```

## 五步流程

| 步 | 页面 | 说明 |
|----|------|------|
| 1 | `index.html` | 「写下我的一生」· 本人来写 / 家人代写 |
| 2 | `epitaph.html` | 墓志铭 + 3 模板 · 字数 **实时** x/200 |
| 3 | `timeline.html` | 按年增删改（示例出生 **1958**） |
| 4 | `photos.html` | 照片占位 + 留给后人的话 |
| 5 | `preview.html` | 碑页预览 · 保存 / 复制链接 / 再改改（竖排大按钮） |

示例人物「王德福」出生年统一为 **1958**。首页可「恢复示例」。

## 技术说明

- 经典 `<script>`，无 ES modules，兼容 `file://`
- `css/styles.css` · `js/app.js`（`localStorage` key `epitaph_web_draft_v2`）
- 正文 ≥18px，大触控目标；分享链接为占位地址

## 压缩包

`/workspace/epitaph-web.zip`

## 演示范围外

无真实上传 / 账号 / 家人密码 / 可访问分享后端 / 语音输入。
