import styles from './index.module.less';
import { message, Typography } from 'antd';
import { Fragment, PropsWithoutRef, useCallback } from 'react';
import { Flex, LabelInput } from '../../../components';
import { IOpenType } from '../types';
import { useRegister, useReloadMyInfo } from '@pjblog/hooks';

export function Register(props: PropsWithoutRef<{ 
  go: (t: IOpenType) => void,
}>) {
  const reload = useReloadMyInfo();
  const {
    account, setAccount,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    execute, loading,
  } = useRegister();
  const submit = useCallback(() => {
    if (!account) return message.warning('请输入账号');
    if (!password) return message.warning('请输入密码');
    if (!confirmPassword) return message.warning('请确认密码');
    if (confirmPassword !== password) return message.warning('两次输入的密码不一致');
    execute()
      .then(reload)
      .then(() => message.success('注册成功'))
      .then(() => props.go('profile'))
      .catch(e => message.error(e.message));
  }, [execute, reload, props.go, account, password, confirmPassword]);
  return <Fragment>
    <LabelInput title="账号" value={account} onChange={e => setAccount(e.target.value)} disabled={loading} autoFocus />
    <LabelInput.Password title="密码" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
    <LabelInput.Password title="确认密码" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading} />
    <LabelInput.Button loading={loading} onClick={submit}>快速注册</LabelInput.Button>
    <Flex align="right" className={styles.extra}>
      <Typography.Text>已有账号？</Typography.Text>
      <Typography.Link onClick={() => props.go('login')}>马上去登录</Typography.Link>
    </Flex>
    <Typography.Paragraph className={styles.tip}>
    重要提示：注册成功后如果没有更新用户信息的请尽可能更新用户信息，以便站长能联系您！
    </Typography.Paragraph>
  </Fragment>
}