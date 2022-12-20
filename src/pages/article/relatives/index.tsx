import styles from './index.module.less';
import dayjs from 'dayjs';
import { useGetAsync } from "@pjblog/hooks"
import { Typography } from "antd";
import { PropsWithoutRef } from "react"
import { usePath } from "../../../hooks";
import { Flex } from '../../../components';

interface IData {
  code: string,
  ctime: string | Date,
  id: number,
  title: string,
}

export function Relatives(props: PropsWithoutRef<{ id: number }>) {
  const ARTICLE = usePath('ARTICLE');
  const { data } = useGetAsync<IData[]>({
    id: 'relatives',
    url: '/' + props.id,
    plugin: 'pjblog-plugin-relative-articles',
  }, [props.id])
  if (!data.length) return <span className={styles.empty}>暂无相关日志数据</span>
  return <ol className={styles.articles}>
    {
      data.map(article => {
        return <li key={article.id}>
          <Flex block align="between" valign="middle" gap={16}>
            <Typography.Link ellipsis onClick={() => ARTICLE.redirect({ code: article.code })}>{article.title}</Typography.Link>
            <span className={styles.date}>[{dayjs(article.ctime).format('YYYY-MM-DD HH:mm:ss')}]</span>
          </Flex>
        </li>
      })
    }
  </ol>
}