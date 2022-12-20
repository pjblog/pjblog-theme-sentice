`PJBlog`主题制作模板。

> 主题命名必须以`pjblog-theme-`开头

## Clone repository

```bash
$ git clone git@github.com:pjblog/pjblog-template-theme.git
$ cd pjblog-template-theme
$ rm -rf .git
$ npm i
```

## Development

```bash
$ npm run dev
```

## Compile

```bash
$ npm run build
```

## Publish

```bash
$ npm publish
```

## Notice

1. `vite.config.ts` 中的 `themeConfigs` 变量配置主题的参数，当然这个参数配置与`theme.configs.json`中的需要一致。
2. 本主题开发为完全自由开发模式，所有接口都已封装于`@pjblog/hooks`中，开发者只需要调用里面的`hooks`即可简单完成逻辑绑定与渲染。
3. 主题开发框架为[codixjs](https://github.com/codixjs/core)，开发者需要阅读此框架的文档以便理解开发模式。PJBlog主题开发采用服务端`SSR`模式，利于SEO，且固定主题框架为`codixjs`。
4. 更多开发参考 [pjblog-theme-darkspace](https://github.com/pjblog/pjblog-theme-darkspace) 与 [pjblog-theme-default](https://github.com/pjblog/pjblog-theme-default) 两个主题的开发代码。