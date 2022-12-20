import styles from './index.module.less';
import { PropsWithoutRef, useCallback, useEffect, useState } from "react";
import { useGetAsync, useMyInfo } from '@pjblog/hooks';
import { ICommentState } from '../types';
import { Comment } from '../comment';
import { CommentPost } from '../comment-post';
import { ReplyStateContext } from './context';
import { Flex } from '../../../components';
import { Pagination } from 'antd';
import { usePath } from '../../../hooks';
import { useRequestHash } from '@codixjs/codix';
import { scrollTo } from '../../../utils';

interface IResponse {
  dataSource: ICommentState[],
  total: number,
  size: number,
}

export function Comments(props: PropsWithoutRef<{ aid: number, page: number, code: string }>) {
  const ARTICLE = usePath('ARTICLE');
  const me = useMyInfo();
  const hash = useRequestHash<string>(v => !!v && v.startsWith('#') ? v.substring(1) : v);
  const [reply, setReply] = useState<ICommentState>(null);
  const { data: { dataSource, total, size }, setData } = useGetAsync<IResponse>({
    id: 'comments',
    url: '/' + props.aid,
    plugin: 'pjblog-plugin-comment',
    encode: props.page + '',
    querys: {
      page: props.page
    }
  }, [props.aid, props.page]);

  /**
   * 添加评论
   */
  const addComment = useCallback((value: ICommentState) => {
    const _dataSource = dataSource.slice(0);
    let _total = total;
    if (value.rid > 0) {
      const current = _dataSource.find(comment => comment.id === value.rid);
      if (current) {
        const _replies = current.replies ? current.replies.slice(0) : [];
        _replies.push(value);
        current.replies = _replies;
      }
    } else {
      _dataSource.unshift(value);
      _total++;
    }
    setData({
      dataSource: _dataSource,
      total: _total, 
      size,
    })
  }, [dataSource, total, size]);

  /**
   * 删除评论
   */
  const delComment = useCallback((index: number, rid: number = 0) => {
    const _dataSource = dataSource.slice(0);
    let _total = total;
    if (rid > 0) {
      const current = _dataSource.find(comment => comment.id === rid);
      if (current && current.replies && current.replies.length) {
        current.replies.splice(index, 1);
      }
    } else {
      _dataSource.splice(index, 1);
      _total--;
    }
    setData({
      dataSource: _dataSource,
      total: _total, 
      size,
    })
  }, [dataSource, total, size]);

  useEffect(() => {
    if (hash) {
      const node = document.getElementById(hash);
      if (node) {
        scrollTo(hash);
      }
    }
  }, [hash]);
  
  return <ReplyStateContext.Provider value={reply}>
    <Flex align="between" valign="middle">
      <div className={styles.comm_title}>评论({total})</div>
      <Pagination total={total} current={props.page} pageSize={size} onChange={p => {
        ARTICLE.redirect({ code: props.code }, {
          page: p + '',
        })
      }} />
    </Flex>
    <div id="comments">
    {
      dataSource.map((comment, index) => {
        return <Comment 
          index={index}
          key={comment.id} 
          value={comment} 
          delComment={delComment} 
          addReply={setReply} 
        />
      })
    }
    </div>
    {me.id > 0 && <CommentPost aid={props.aid} addComment={addComment} addReply={setReply} />}
  </ReplyStateContext.Provider>
}