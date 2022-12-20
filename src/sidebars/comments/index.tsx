import styles from './index.module.less';
import dayjs from 'dayjs';
import { useGetAsync } from '@pjblog/hooks';
import { usePath } from '../../hooks';
import { Divider, Typography } from 'antd';

interface IComment {
  id: number,
  code: string,
  content: string,
  time: string | Date,
  user: {
    nickname: string,
    avatar: string,
  }
}

export function Comments() {
  const ARTICLE = usePath('ARTICLE');
  const { data } = useGetAsync<IComment[]>({
    id: 'comments:latest',
    url: '/latest',
    plugin: 'pjblog-plugin-comment',
  })

  return <ul className={styles.articles}>
    {
      data.map(comment => {
        return <li key={comment.id} onClick={() => ARTICLE.redirect({ code: comment.code }, { page: '1' }, 'comm_' + comment.id)}>
          <Typography.Paragraph ellipsis={{rows: 4  }} className={styles.content}>{comment.content}</Typography.Paragraph>
          <Typography.Text ellipsis className={styles.user}>
            {comment.user.nickname}
            <Divider type="vertical" />
            {dayjs(comment.time).format('YYYY-MM-DD HH:mm:ss')}
          </Typography.Text>
        </li>
      })
    }
  </ul>
}