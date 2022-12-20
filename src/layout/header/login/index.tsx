import styles from './index.module.less';
import { message, Typography } from 'antd';
import { Fragment, PropsWithoutRef, useCallback } from 'react';
import { Flex, LabelInput } from '../../../components';
import { IOpenType } from '../types';
import { useLogin, useReloadMyInfo } from '@pjblog/hooks';

export function Login(props: PropsWithoutRef<{ 
  go: (t: IOpenType) => void,
  close: () => void
}>) {
  const reload = useReloadMyInfo();
  const {
    account, setAccount,
    password, setPassword,
    execute, loading,
  } = useLogin();
  const submit = useCallback(() => {
    if (!account) return message.warning('请输入账号');
    if (!password) return message.warning('请输入密码');
    execute()
      .then(reload)
      .then(() => message.success('登录成功'))
      .then(props.close)
      .catch(e => message.error(e.message));
  }, [execute, reload, props.close, account, password]);
  return <Fragment>
    <LabelInput title="账号" value={account} onChange={e => setAccount(e.target.value)} disabled={loading} autoFocus />
    <LabelInput.Password title="密码" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
    <LabelInput.Button loading={loading} onClick={submit}>快速登录</LabelInput.Button>
    <Flex align="right" className={styles.extra}>
      <Typography.Text>还没有账号？</Typography.Text>
      <Typography.Link onClick={() => props.go('register')}>马上去注册</Typography.Link>
    </Flex>
    <Typography.Paragraph className={styles.tip}>
    重要提示：登入成功后如果没有更新用户信息的请尽可能更新用户信息，以便站长能联系您！
    </Typography.Paragraph>
  </Fragment>
}