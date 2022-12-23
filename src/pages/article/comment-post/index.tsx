import styles from './index.module.less';
import classnames from 'classnames';
import CodeMirror from '@uiw/react-codemirror';
import dayjs from 'dayjs';
import { reloadHttpRequest, request, useMyInfo } from "@pjblog/hooks"
import { Avatar, Button, message, Tabs, Typography } from "antd";
import { PropsWithoutRef, useCallback, useEffect, useState } from "react";
import { Flex } from "../../../components";
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useAsyncCallback, useClient } from '@codixjs/fetch';
import { ICommentState } from '../types';
import { scrollTo } from '../../../utils';
import { useReply } from '../comments/context';
import { CloseOutlined } from '@ant-design/icons';

const tabs = [
  {
    label: 'Write',
    key: 'write',
  },
  {
    label: 'Preview',
    key: 'preview',
  }
]

// @ts-ignore
const Coder: CodeMirror = CodeMirror?.default;

export function CommentPost(props: PropsWithoutRef<{
  aid: number,
  addComment: (v: ICommentState) => void,
  addReply: React.Dispatch<React.SetStateAction<ICommentState>>
}>) {
  const me = useMyInfo();
  const client = useClient();
  const reply = useReply();
  const [type, setType] = useState<string>('write');
  const [value, setValue] = useState<string>('');

  /**
   * 预览请求
   */
  const preview = useAsyncCallback(async () => {
    const res = await request.post<{ html: string }>('/plugin/pjblog-plugin-comment/preview', {
      content: value,
    })
    return res.data.html;
  })

  /**
   * 发表评论
   */
  const post = useAsyncCallback(async () => {
    const res = await request.put<ICommentState>(
      '/plugin/pjblog-plugin-comment/' + props.aid, 
      { content: value }, 
      {
        params: {
          cid: reply?.id || 0
        }
      }
    );
    return res.data;
  })

  const resolve = useCallback((e: ICommentState) => {
    props.addComment(e);
    setValue('');
    reloadHttpRequest(client, 'articles', 'comments:latest');
    setTimeout(() => scrollTo('comm_' + e.id))
  }, [props.addComment, setValue]);

  /**
   * 发表回调
   */
  const submit = useCallback(() => {
    post.execute()
      .then(resolve)
      .then(() => message.success('发表评论成功'))
      .catch(e => message.error(e.message))
  }, [post.execute, props.addComment, resolve])

  useEffect(() => {
    if (type === 'preview' && !!value) {
      preview.execute();
    }
  }, [value, type]);

  return <Flex block gap={16} id="comm_post">
    <Avatar src={me.avatar} size={40} />
    <Flex span={1} scroll="hide" className={classnames('box', styles.container)} direction="vertical">
      <div className={styles.topbar}>
        <Tabs type="card" onChange={setType} activeKey={type} items={tabs} />
      </div>
      {!!reply && <div className={styles.reply}>
        <Flex className={styles.reply_title} align="between" valign="middle" block>
          <span>回复 <strong>{reply.user.nickname}</strong> 在 {dayjs(reply.ctime).format('YYYY-MM-DD HH:mm:ss')} 发表的评论：</span>
          <Typography.Link onClick={() => props.addReply(null)}><CloseOutlined /></Typography.Link>
        </Flex>
        <div dangerouslySetInnerHTML={{ __html: reply.html }} className={classnames('markdown', styles.reply_content)}></div>
      </div>}
      <div className={styles.body}>
        {type === 'write' && <div className={styles.editor}>
          <Coder 
            minHeight="100px"
            value={value} 
            extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]} 
            onChange={e => setValue(e)} 
            placeholder="请输入评论内容..."
          />
        </div>}
        {type === 'preview' && <div 
          dangerouslySetInnerHTML={{ __html: preview.data }} 
          className={classnames('markdown', styles.html)} />}
        <Flex align="between" valign="middle" className={styles.submit}>
          <Typography.Text type="secondary">支持`Markdown`语法</Typography.Text>
          <Button type="primary" loading={post.loading} onClick={submit}>发表</Button>
        </Flex>
      </div>
    </Flex>
  </Flex>
}