import { useGetAsync } from '@pjblog/hooks';
import { Typography } from 'antd';
import { Flex } from '../../components';
import { usePath } from '../../hooks';
import styles from './index.module.less';

interface IArticle {
  title: string,
  code: string,
  count: number,
}

export function HotPrints() {
  const ARTICLE = usePath('ARTICLE');
  const { data } = useGetAsync<IArticle[]>({
    id: 'hot-prints',
    url: '/hot',
    plugin: 'pjblog-plugin-reprint-article'
  })

  return <ul className={styles.articles}>
    {
      data.map(article => {
        return <li key={article.code}>
          <Flex block align="between" valign="middle" gap={8}>
            <Flex span={1}>
              <Typography.Link className={styles.article_title} ellipsis onClick={() => ARTICLE.redirect({ code: article.code })}>{article.title}</Typography.Link>
            </Flex>
            <span className={styles.reads}>[{article.count}]</span>
          </Flex>
        </li>
      })
    }
  </ul>
}