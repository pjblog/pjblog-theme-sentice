import styles from './index.module.less';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { Flex, Loading, SideBar } from "../../components";
import { useCategorySetter } from '../../layout';
import { useRequestParam, useRequestQuery } from '@codixjs/codix';
import { createArticlesQuery, useArticle, transformHeadings, IArticleHeaded, useMyInfo, useThemeConfigs, IArticleWithHtml, request } from '@pjblog/hooks';
import { Typography, Row, Col, Divider, Tag, Space, Avatar, Anchor, Input, Button, message } from 'antd';
import { Fragment, PropsWithoutRef, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { usePath } from '../../hooks';
import { Relatives } from './relatives';
import { Comments } from './comments';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { numberic, scrollTo, ThemeConfigs } from '../../utils';
import { Comments as LatestComments, HotPrints, CloudTags, HotArticles } from '../../sidebars';
import { useAsyncCallback } from '@codixjs/fetch';

const { Link } = Anchor;

interface IArticle extends IArticleWithHtml {
  prints: {
    level: number,
    total: number,
    token: string,
  }
}

export default function Article() {
  const me = useMyInfo();
  const themeConfigs = useThemeConfigs<ThemeConfigs>();
  const HOME = usePath('HOME');
  const ARTICLE = usePath('ARTICLE');
  const page = useRequestQuery('page', numberic(1)) as number;
  const code = useRequestParam<string>('code');
  const { data } = useArticle<IArticle>(code);
  const setCategory = useCategorySetter();
  const headings = useMemo(() => transformHeadings(data.headings), [data.headings])
  useEffect(() => {
    if (data.category.id) {
      setCategory(data.category.id);
      return () => setCategory(0);
    }
  }, [data.category.id]);

  useEffect(() => scrollTo('article'), [code]);

  return <Flex block align="between" gap={16} className="wraper" id="article">
    <div className={classnames('content', 'box')}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <div className={classnames('content', 'box', styles.content)}>
            <Typography.Text className={styles.date}>
              <Tag className={styles.category} color="#1890ff" onClick={() => HOME.redirect({}, createArticlesQuery({ category: data.category.id }))}>{data.category.name}</Tag>
              发布于 {dayjs(data.ctime).format('YYYY-MM-DD HH:mm:ss')}
              <Divider type="vertical" />
              修改于 {dayjs(data.mtime).format('YYYY-MM-DD HH:mm:ss')}
            </Typography.Text>
            <Typography.Title level={2} className={styles.title}>{data.title}</Typography.Title>
            <Flex valign="middle" className={styles.extra}>
              <Space size={4}>
                <Avatar src={data.user.avatar} size={18} />
                {data.user.nickname}
              </Space>
              <Divider type="vertical" />
              <Space>
                阅读量
                <span>{data.readCount} 次</span>
              </Space>
              <Divider type="vertical" />
              {
                data.original
                  ? <span>原创</span>
                  : <Flex valign="middle">转载自：<Typography.Link ellipsis href={data.from} target="_blank">{data.from}</Typography.Link></Flex>
              }
            </Flex>
            <div className={classnames('markdown', styles.html)} dangerouslySetInnerHTML={{ __html: data.html }}></div>
            {!!data.tags.length && <Fragment>
              <Divider orientation="left" plain>标签</Divider>
              {
                data.tags.map(tag => <Tag 
                  className={styles.tag} 
                  key={tag.id} 
                  onClick={() => HOME.redirect({}, createArticlesQuery({ tag: tag.id }))}
                >{tag.name}</Tag>)
              }
            </Fragment>}
          </div>
        </Col>
        <Col span={12}>
          {!!data.prev && <Flex block className={classnames('box', styles.extraBar)} align="left" gap={8}>
            <div className={styles.dot}><LeftOutlined /></div>
            <Flex className={styles.channel} direction="vertical" align="left">
              <div className={styles.tit}>PREV POST</div>
              <div className={styles.time}>{dayjs(data.prev.ctime).format('YYYY-MM-DD HH:mm:ss')}</div>
              <Typography.Link onClick={() => ARTICLE.redirect({ code: data.prev.code })} ellipsis className={styles.artTitle}>{data.prev.title}</Typography.Link>
            </Flex>
          </Flex>}
        </Col>
        <Col span={12}>
          {!!data.next && <Flex block className={classnames('box', styles.extraBar)} align="right" gap={8}>
            <Flex className={styles.channel} direction="vertical" align="right">
              <div className={styles.tit}>NEXT POST</div>
              <div className={styles.time}>{dayjs(data.next.ctime).format('YYYY-MM-DD HH:mm:ss')}</div>
              <Typography.Link onClick={() => ARTICLE.redirect({ code: data.next.code })} ellipsis className={styles.artTitle}>{data.next.title}</Typography.Link>
            </Flex>
            <div className={styles.dot}><RightOutlined /></div>
          </Flex>}
        </Col>
        <Col span={24}>
          <SideBar title="相关日志" padable>
            <Suspense fallback={<Loading />}><Relatives id={data.id} /></Suspense>
          </SideBar>
        </Col>
        {(me.id > 0 || (me.id === 0 && themeConfigs.showCommentsWhenNotLogined)) && <Col span={24}><Comments aid={data.id} page={page} code={data.code} /></Col>}
      </Row>
    </div>
    <div className="sidebar">
      <Row gutter={[0, 16]}>
        {data.prints.level >= 0 && <Reprints 
          level={data.prints.level} 
          token={data.prints.token}
          total={data.prints.total} 
          code={data.code}
        />}
        {
          !headings.length
            ? <Fragment>
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
                <Suspense fallback={<Loading />}><LatestComments /></Suspense>
                </SideBar>
              </Col>
              </Fragment>
            : <Col span={24}>
                <Anchor affix offsetTop={84}>
                  <Links dataSource={headings} />
                </Anchor>
              </Col>
        }
      </Row>
    </div>
  </Flex>
}

export function Links(props: PropsWithoutRef<{ dataSource: IArticleHeaded[] }>) {
  if (!props.dataSource.length) return;
  return <Fragment>
    {
      props.dataSource.map(chunk => {
        return <Link href={'#' + chunk.id} title={chunk.name} key={chunk.id}>
          <Links dataSource={chunk.children} />
        </Link>
      })
    }
  </Fragment>
}

function Reprints(props: PropsWithoutRef<{ 
  level: number,
  token: string,
  total: number,
  code: string,
}>) {
  const [value, setValue] = useState<string>(null);
  const { execute, loading } = useAsyncCallback(async (value: string) => {
    const res = await request.put<{ level: number }>('/plugin/pjblog-plugin-reprint-article/provider/' + props.code, {
      base64: value,
    })
    return res.data.level;
  })
  const submit = useCallback(() => {
    if (!value) return;
    execute(value)
      .then((level) => {
        switch (level) {
          case 0: return message.success('申请已提交，等待博主通过！');
          case 1: return message.success('博文已同步至您的博客，请返回您的博客查看！');
          default: return message.warning('非法操作');
        }
      })
      .catch(e => message.error(e.message))
      .finally(() => setValue(null));
  }, [value])
  return <Col span={24}>
    <SideBar title="转载信息" padable>
      <Typography.Paragraph>本文共被转载了 <strong>{props.total}</strong> 次</Typography.Paragraph>
      <div className={styles.print_code}>
        <Typography.Text copyable={{ text: props.token }}>{props.token}</Typography.Text>
      </div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input.TextArea value={value} onChange={e => setValue(e.target.value)} rows={3} placeholder="请输入转载码..."></Input.TextArea>
        <Button type="primary" block size="large" onClick={submit} loading={loading} disabled={!value}>申请转载</Button>
      </Space>
    </SideBar>
  </Col>
}