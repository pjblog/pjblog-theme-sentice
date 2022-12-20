import React from 'react';
import { Scripts, PreLoads, Css, THtmlProps } from '@codixjs/server';

// https://blog.csdn.net/u012767761/article/details/111149733
export default function HTML(props: React.PropsWithChildren<THtmlProps<{
  blog_keywords: string,
  blog_copyright: string,
  blog_name: string,
  blog_description: string,
  blog_theme: string,
  blog_favicon_url: string,
}>>) {
  return <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <link rel="icon" type="image/svg+xml" href={props.state?.blog_favicon_url || '/favicon.ico'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={props.state?.blog_description} />
      <meta name="keywords" content={props.state?.blog_keywords} />
      <meta name="copyright" content={props.state?.blog_copyright} />
      <meta name="blog" content="pjblog" />
      <meta name="theme" content={props.state?.blog_theme} />
      <meta name="renderer" content="webkit" />
      <title>{props.state?.blog_name}</title>
      <Scripts dataSource={props.assets.headerScripts} />
      <PreLoads dataSource={props.assets.headerPreloadScripts}/>
      <Css dataSource={props.assets.headerCsses} />
    </head>
    <body>
      <div id="root">{props.children}</div>
      <Scripts dataSource={props.assets.bodyScripts} />
    </body>
  </html>
}