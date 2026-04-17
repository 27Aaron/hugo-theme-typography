<div align="center">

# Hugo Theme Typography

此主题系 Hexo 主题 [活版印字](https://github.com/SumiMakito/hexo-theme-typography/) 在 Hugo 平台上的移植版本。

</div>

一款注重排版的 Hugo 博客主题，支持亮色/暗色模式切换、带行号的代码高亮和简洁的阅读体验。

## 特性

- 亮色 / 暗色 / 跟随系统 三种主题模式
- 代码高亮 + 行号显示（Chroma）
- 30+ 语言角标
- 响应式布局
- RSS 支持
- 分类 & 标签

## 安装

```bash
cd your-hugo-site
git submodule add https://github.com/27Aaron/hugo-theme-typography.git themes/hugo-theme-typography
```

## 配置

在站点根目录的 `hugo.toml` 中添加以下配置：

```toml
baseURL = "https://example.com/"
languageCode = "zh-cn"
theme = "hugo-theme-typography"
title = "你的博客标题"

[params]
  titlePrimary = "主标题"
  titleSecondary = "副标题"
  themeStyle = "auto"
  pageSize = 5
  showPageCount = true
  showCategories = true
  showTags = true
  keywords = ["blog", "typography"]

  [params.social]
    twitter = ""
    github = ""
    instagram = ""
    weibo = ""
    rss = true

[markup]
  [markup.highlight]
    lineNos = true
    lineNumbersInTable = true
    noClasses = false
    style = "monokai"

[taxonomies]
  category = "categories"
  tag = "tags"
```

### 基础参数

| 参数             | 默认值   | 说明                                      |
| ---------------- | -------- | ----------------------------------------- |
| `titlePrimary`   | —        | 侧边栏主标题                              |
| `titleSecondary` | —        | 侧边栏副标题                              |
| `themeStyle`     | `"auto"` | 主题模式：`"light"` / `"dark"` / `"auto"` |
| `pageSize`       | `5`      | 每页文章数                                |
| `showPageCount`  | `true`   | 显示文章总数                              |
| `showCategories` | `true`   | 侧边栏显示分类                            |
| `showTags`       | `true`   | 侧边栏显示标签                            |
| `keywords`       | —        | 站点关键词                                |

### 社交链接

| 参数        | 说明                         |
| ----------- | ---------------------------- |
| `twitter`   | Twitter 用户名               |
| `github`    | GitHub 用户名                |
| `instagram` | Instagram 用户名             |
| `weibo`     | 微博用户名                   |
| `rss`       | 启用 RSS（`true` / `false`） |

### 代码高亮

| 参数                 | 默认值      | 说明                                                     |
| -------------------- | ----------- | -------------------------------------------------------- |
| `lineNos`            | `true`      | 显示行号                                                 |
| `lineNumbersInTable` | `true`      | 使用表格布局渲染行号                                     |
| `noClasses`          | `false`     | 使用 CSS 类名控制配色（必须为 `false` 才能自定义颜色）   |
| `style`              | `"monokai"` | Chroma 内置样式名（实际配色由 CSS 变量覆盖，此值为兜底） |

> `noClasses` 必须设为 `false`，否则主题的语法高亮配色不会生效。
