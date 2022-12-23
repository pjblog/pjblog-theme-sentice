import styles from './index.module.less';
import classnames from 'classnames';
import { createArticlesQuery, useArticles, useConfigs, IArticlesInput, useThemeConfigs } from "@pjblog/hooks"
import { Flex, Loading, SideBar } from "../../components";
import { numberic, ThemeConfigs } from "../../utils";
import { useRequestQuery } from '@codixjs/codix';
import { Article } from './article';
import { Col, Pagination, Row, Typography } from 'antd';
import { usePath } from '../../hooks';
import { HotArticles, CloudTags, Comments, HotPrints } from '../../sidebars';
import { Suspense } from 'react';
import { IArticle } from './types';

export default function HomePage() {
  const configs = useConfigs();
  const HOME = usePath('HOME');
  const themeConfigs = useThemeConfigs<ThemeConfigs>();
  const keyword = useRequestQuery<string>('keyword');
  const category = useRequestQuery('category', numberic(0)) as number;
  const tag = useRequestQuery('tag', numberic(0)) as number;
  const page = useRequestQuery('page', numberic(1)) as number;
  const { data: { dataSource, total } } = useArticles<IArticlesInput, IArticle>({ keyword, category, tag, page });
  return <Flex block align="between" gap={16} className="wraper">
    <div className={classnames('content', 'box', styles.content)}>
      <div className={styles.photo}>
        <img src={themeConfigs.banner}/>
        <Flex className={styles.description} direction="vertical" full block align="center" valign="middle" style={{ color: themeConfigs.bannerColor }}>
          <Typography.Title level={3} className={styles.t} style={{ color: themeConfigs.bannerColor }}>{configs.name}</Typography.Title>
          <Typography.Paragraph className={styles.p} style={{ color: themeConfigs.bannerColor }}>{configs.description}</Typography.Paragraph>
        </Flex>
      </div>
      {dataSource.map(article => <Article {...article} key={article.id} />)}
      <Flex align="center" valign="middle" className={styles.page}>
        <Pagination current={page} total={total} pageSize={configs.article_size} onChange={p => {
          HOME.redirect({}, createArticlesQuery({ keyword, category, tag, page: p }));
        }} />
      </Flex>
    </div>
    <div className="sidebar">
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <SideBar title="公告" padable>
            <Typography.Text className={styles.notice}>{configs.notice}</Typography.Text>
          </SideBar>
        </Col>
        <Col span={24}>
          <SideBar title="热门文章" padable>
            <Suspense fallback={<Loading />}><HotArticles /></Suspense>
          </SideBar>
        </Col>
        <Col span={24}>
          <SideBar title="热门转载" padable>
            <Suspense fallback={<Loading />}><HotPrints /></Suspense>
          </SideBar>
        </Col>
        <Col span={24}>
          <SideBar title="标签云" padable>
          <Suspense fallback={<Loading />}><CloudTags /></Suspense>
          </SideBar>
        </Col>
        <Col span={24}>
          <SideBar title="最新评论">
          <Suspense fallback={<Loading />}><Comments /></Suspense>
          </SideBar>
        </Col>
        {/* <Col span={24}>
          <SideBar title="友情链接" padable>
          Coming soon ...
          </SideBar>
        </Col> */}
      </Row>
    </div>
  </Flex>
}