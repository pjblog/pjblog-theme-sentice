import styles from './index.module.less';
import classnames from 'classnames';
import { PropsWithChildren, Suspense } from "react";
import { Affix, Divider, Typography } from 'antd';
import { Header, CategoryProvider } from './header';
import { Flex, Loading } from '../components';
import { useConfigs } from "@pjblog/hooks";

export * from './header';

export function Layout(props: PropsWithChildren<{}>) {
  const configs = useConfigs();
  return <CategoryProvider>
    <Affix offsetTop={0}>
      <Suspense fallback={<Loading />}><Header /></Suspense>
    </Affix>
    <main className="container">
      {props.children}
    </main>
    <footer className={classnames('container', styles.footer)}>
      <Flex block align="center" valign="middle" direction="vertical">
        <div className={styles.item}>
          Using theme <Typography.Link href={'https://npmjs.com/' + configs.theme} target="_blank">{configs.theme}</Typography.Link>
          <Divider type="vertical" />
          Powered by PJBLOG
        </div>
        <div className={styles.item}>
          {configs.icp}
          <Divider type="vertical" />
          {configs.copyright}
        </div>
      </Flex>
    </footer>
  </CategoryProvider>
}