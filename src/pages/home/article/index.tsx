import dayjs from 'dayjs';
import classnames from 'classnames';
import styles from './index.module.less';
import { PropsWithoutRef } from 'react';
import { createArticlesQuery, IAricleWithSummary } from '@pjblog/hooks';
import { Flex } from '../../../components';
import { Divider, Typography } from 'antd';
import { usePath } from '../../../hooks';
import { IArticle } from '../types';

export function Article(props: PropsWithoutRef<IArticle>) {
  const HOME = usePath('HOME');
  const ARTICLE = usePath('ARTICLE');
  return <Flex className={styles.article} gap={20}>
    <div className={styles.date}>
      <div className={styles.month}>{dayjs(props.ctime).format('MM')}月</div>
      <div className={styles.day}>{dayjs(props.ctime).format('DD')}</div>
    </div>
    <Flex className={styles.preview} span={1} direction="vertical">
      <Typography.Link 
        className={styles.title} 
        onClick={() => ARTICLE.redirect({ code: props.code })}
      >{props.title}</Typography.Link>
      <div className={styles.info}>
        <span>{dayjs(props.ctime).format('YYYY年 HH:mm')}</span>
        <Divider type="vertical" />
        分类：<Typography.Link 
          className={styles.category}
          onClick={() => HOME.redirect({}, createArticlesQuery({ category: props.category.id }))}
        >{props.category.name}</Typography.Link>
        <Divider type="vertical" />
        作者：{props.user.nickname}
        <Divider type="vertical" />
        阅读量：{props.readCount} 次
        <Divider type="vertical" />
        评论数：{props.comments} 条
      </div>
      <div dangerouslySetInnerHTML={{ __html: props.summary }} className={classnames('markdown', styles.markdown)}></div>
      <Flex className={styles.tags} gap={8} valign="middle">
        {
          props.tags.map(tag => {
            return <div className={styles.tag} key={tag.id} onClick={() => HOME.redirect({}, createArticlesQuery({ tag: tag.id }))}>{tag.name}</div>
          })
        }
      </Flex>
    </Flex>
  </Flex>
}