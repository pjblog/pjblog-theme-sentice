import classnames from 'classnames';
import dayjs from 'dayjs';
import styles from './index.module.less';
import { Avatar, Timeline, Typography, message, Space, Tooltip, Popconfirm } from "antd";
import { PropsWithoutRef, PropsWithRef, useCallback } from "react";
import { Flex } from "../../../components";
import { ICommentState } from "../types";
import { DeleteOutlined, CommentOutlined } from '@ant-design/icons';
import { scrollTo } from '../../../utils';
import { useAsyncCallback } from '@codixjs/fetch';
import { request, useMyInfo } from '@pjblog/hooks';

export function Comment(props: PropsWithoutRef<{ 
  index: number,
  value: ICommentState,
  delComment: (index: number, rid?: number) => void,
  addReply: React.Dispatch<React.SetStateAction<ICommentState>>
}>) {
  const me = useMyInfo();
  const { execute } = useAsyncCallback(async () => {
    const res = await request.delete('/plugin/pjblog-plugin-comment/' + props.value.id);
    return res.data;
  })

  const onReply = useCallback(() => {
    props.addReply(props.value);
    setTimeout(() => scrollTo('comm_post'))
  }, [props.addReply, props.value]);

  const onDelete = useCallback(() => {
    execute()
      .then(() => props.delComment(props.index))
      .then(() => message.success('删除成功'))
      .catch(e => message.error(e.message));
  }, [execute, props.index, props.delComment]);
  
  return <Flex block gap={16} id={'comm_' + props.value.id}>
    <Avatar src={props.value.user.avatar} size={40} />
    <Flex span={1} scroll="hide" direction="vertical" className={classnames('box', styles.container)}>
      <Flex className={styles.topbar} align="between" valign="middle" block>
        <div className={styles.user}>
          <strong>{props.value.user.nickname}</strong> commented {dayjs(props.value.ctime).format('YYYY-MM-DD HH:mm:ss')}
        </div>
        <Space>
          {me.id > 0 && <Tooltip title="回复" placement="top">
            <Typography.Link onClick={onReply}><CommentOutlined /></Typography.Link>
          </Tooltip>}
          {(me.level <= 1 || me.id === props.value.user.id) && <Tooltip title="删除" placement="top">
            <Popconfirm title="确定要删除此评论？" okText="删除" cancelText="放弃" placement="bottom" onConfirm={onDelete}>
              <Typography.Link><DeleteOutlined /></Typography.Link>
            </Popconfirm>
          </Tooltip>}
        </Space>
      </Flex>
      <div className={classnames('markdown', styles.html)} dangerouslySetInnerHTML={{ __html: props.value.html }}></div>
      {!!props.value?.replies?.length && <div className={styles.replies}>
        <div className={styles.replies_content}>
          <Timeline>
          {
            props.value.replies.map((comment, index) => {
              return <Reply key={comment.id} value={comment} index={index} delComment={props.delComment} />
            })
          }
          </Timeline>
        </div>
      </div>}
    </Flex>
  </Flex>
}

function Reply(props: PropsWithRef<{ 
  value: ICommentState, 
  index: number, 
  delComment: (index: number, rid?: number) => void
}>) {
  const me = useMyInfo();
  const { execute } = useAsyncCallback(async () => {
    const res = await request.delete('/plugin/pjblog-plugin-comment/' + props.value.id);
    return res.data;
  })
  const onDelete = useCallback(() => {
    execute()
      .then(() => props.delComment(props.index, props.value.rid))
      .then(() => message.success('删除成功'))
      .catch(e => message.error(e.message));
  }, [execute, props.index, props.delComment]);
  return <Timeline.Item dot={<Avatar src={props.value.user.avatar} />}>
    <Flex block direction="vertical" id={'comm_' + props.value.id}>
      <Flex className={styles.user} block align="between" valign="middle">
        <span><strong>{props.value.user.nickname}</strong> commented {dayjs(props.value.ctime).format('YYYY-MM-DD HH:mm:ss')}</span>
        {(me.level <= 1 || me.id === props.value.user.id) && <Tooltip title="删除" placement="top">
            <Popconfirm title="确定要删除此评论？" okText="删除" cancelText="放弃" placement="bottom" onConfirm={onDelete}>
              <Typography.Link><DeleteOutlined /></Typography.Link>
            </Popconfirm>
          </Tooltip>}
      </Flex>
      <div className={classnames('markdown', styles.html)} dangerouslySetInnerHTML={{ __html: props.value.html }}></div>
    </Flex>
  </Timeline.Item>
}