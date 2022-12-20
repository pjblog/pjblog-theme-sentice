import { useGetAsync } from '@pjblog/hooks';
import { Typography } from 'antd';
import { Flex } from '../../components';
import { usePath } from '../../hooks';
import styles from './index.module.less';

interface IArticle {
  title: string,
  id: number,
  code: string,
  ctime: string | Date,
  reads: number,
}

export function HotArticles() {
  const ARTICLE = usePath('ARTICLE');
  const { data } = useGetAsync<IArticle[]>({
    id: 'hot-articles',
    url: '/',
    plugin: 'pjblog-plugin-hot-articles'
  })

  return <ul className={styles.articles}>
    {
      data.map(article => {
        return <li key={article.id}>
          <Flex block align="between" valign="middle" gap={8}>
            <Flex span={1}>
              <Typography.Link ellipsis onClick={() => ARTICLE.redirect({ code: article.code })}>{article.title}</Typography.Link>
            </Flex>
            <span className={styles.reads}>[{article.reads}]</span>
          </Flex>
        </li>
      })
    }
  </ul>
}