import { Application, HistoryMode, withImport } from '@codixjs/codix';
import { Client, ClientProvider } from '@codixjs/fetch';
import { BlogProvider } from '@pjblog/hooks';
import { BlogError, Loading } from '../components';
import { createCache, StyleProvider } from '@ant-design/cssinjs';
import { Layout } from '../layout';
import { ConfigProvider } from 'antd';

export default function(app: Application<HistoryMode>) {
  const client = new Client();
  const cache = createCache();

  if (typeof window !== 'undefined' && window.INITIALIZE_STATE) {
    client.initialize(window.INITIALIZE_STATE);
  }

  // SSR 数据容器
  // 注入来自服务端数据
  app.use(ClientProvider, { client });

  // antd 样式抽离
  app.use(StyleProvider, { cache });

  app.use(ConfigProvider, {
    theme: {
      token: {
        colorPrimary: '#ff3657',
        colorInfo: '#ff3657'
      }
    }
  })

  // 博客基础数据注入
  app.use(BlogProvider, { 
    fallback: 'loading...',
    close: 'website closed...',
    forbiden: 'current user forbiden ...',
    error: BlogError,
  });

  // 注入统一布局
  app.use(Layout);

  const HOME = app.bind(
    '/', 
    ...withImport(() => import('./home'), { 
      fallback: <Loading />
    })
  );

  const ARTICLE = app.bind<{ code: string }>('/article/:code', ...withImport(() => import('./article'), { 
    fallback: <Loading />
  }))

  return {
    HOME,
    ARTICLE,
    client,
    cache,
  }
}