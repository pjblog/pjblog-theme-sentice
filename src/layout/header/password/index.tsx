import styles from './index.module.less';
import { message, Typography } from 'antd';
import { Fragment, PropsWithoutRef, useCallback } from 'react';
import { LabelInput } from '../../../components';
import { usePassword, useReloadMyInfo } from '@pjblog/hooks';
import { IOpenType } from '../types';

export function Password(props: PropsWithoutRef<{ go: (t: IOpenType) => void, }>) {
  const reload = useReloadMyInfo();
  const {
    newPassword, setNewPassword,
    oldPassword, setOldPassword,
    comPassword, setComPassword,
    execute, loading,
  } = usePassword();
  const submit = useCallback(() => {
    if (!newPassword) return message.warning('请输入新密码');
    if (!oldPassword) return message.warning('请输入旧密码');
    if (newPassword !== comPassword) return message.warning('两次输入的密码不一致');
    execute()
      .then(reload)
      .then(() => message.success('更新密码成功'))
      .then(() => props.go('login'))
      .catch(e => message.error(e.message));
  }, [execute, reload, props.go, newPassword, oldPassword, comPassword]);
  return <Fragment>
    <LabelInput.Password title="旧密码" value={oldPassword} onChange={e => setOldPassword(e.target.value)} disabled={loading} autoFocus />
    <LabelInput.Password title="新密码" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={loading} />
    <LabelInput.Password title="确认密码" value={comPassword} onChange={e => setComPassword(e.target.value)} disabled={loading} />
    <LabelInput.Button loading={loading} onClick={submit}>更新密码</LabelInput.Button>
    <Typography.Paragraph className={styles.tip}>
    重要提示：更新密码后需要您重新登录以便系统更新您目前的资料信息。
    </Typography.Paragraph>
  </Fragment>
}