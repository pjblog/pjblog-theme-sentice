import { createArticlesQuery, useGetAsync } from '@pjblog/hooks';
import { usePath } from '../../hooks';
import styles from './index.module.less';
import { Tag } from 'antd';

interface Itag {
  count: number
  id: number
  name: string
}

export function CloudTags() {
  const HOME = usePath('HOME');
  const { data } = useGetAsync<Itag[]>({
    id: 'cloud-tags',
    url: '/tags/hot',
    plugin: 'pjblog-plugin-tags'
  })
  return <div className={styles.tags}>
    {
      data.map(tag => <Tag 
        className={styles.tag} 
        key={tag.id}
        onClick={() => HOME.redirect({}, createArticlesQuery({ tag: tag.id }))}
      >{tag.name}({tag.count})</Tag>)
    }
  </div>
}