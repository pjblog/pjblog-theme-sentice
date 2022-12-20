import styles from './index.module.less';
import { message, Typography } from 'antd';
import { Fragment, PropsWithoutRef, useCallback } from 'react';
import { LabelInput } from '../../../components';
import { useProfile, useReloadMyInfo } from '@pjblog/hooks';

export function Profile(props: PropsWithoutRef<{ close: () => void }>) {
  const reload = useReloadMyInfo();
  const {
    nickname, setNickname,
    email, setEmail,
    avatar, setAvatar,
    website, setWebsite,
    execute, loading,
  } = useProfile();
  const submit = useCallback(() => {
    if (!nickname) return message.warning('请输入昵称');
    if (!email) return message.warning('请输入邮箱');
    execute()
      .then(reload)
      .then(() => message.success('更新成功'))
      .then(props.close)
      .catch(e => message.error(e.message));
  }, [execute, reload, props.close, nickname, email]);
  return <Fragment>
    <LabelInput title="昵称" value={nickname} onChange={e => setNickname(e.target.value)} disabled={loading} autoFocus />
    <LabelInput title="邮箱" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
    <LabelInput title="头像地址" value={avatar} onChange={e => setAvatar(e.target.value)} disabled={loading} />
    <LabelInput title="个人网站" value={website} onChange={e => setWebsite(e.target.value)} disabled={loading} />
    <LabelInput.Button loading={loading} onClick={submit}>更新资料</LabelInput.Button>
    <Typography.Paragraph className={styles.tip}>
    重要提示：昵称与邮箱为必选项，请您一定要填写。更新完毕后您的头像将出现在评论处。
    </Typography.Paragraph>
  </Fragment>
}