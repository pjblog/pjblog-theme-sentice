import styles from './index.module.less';
import { Flex } from '../../components';
import { useCategories, useLogout, useMyInfo, useReloadMyInfo, useThemeConfigs } from '@pjblog/hooks';
import { Category } from './category';
import { Search } from './search';
import { Login } from './login';
import { Register } from './register';
import { Modalure } from './modal';
import { Title } from './title';
import { Profile } from './profile';
import { Password } from './password';
import { usePath } from '../../hooks';
import { startTransition, useCallback, useMemo, useState } from 'react';
import { Avatar, Button, Space, Dropdown, MenuProps, message } from 'antd';
import { CaretDownOutlined, ProfileOutlined, LockOutlined, LogoutOutlined, LaptopOutlined } from '@ant-design/icons';
import type { IOpenType } from './types';
import type { ThemeConfigs } from '../../utils';

export * from './category';

export function Header() {
  const HOME = usePath('HOME');
  const me = useMyInfo();
  const themeConfigs = useThemeConfigs<ThemeConfigs>();
  const { data } = useCategories();
  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState<IOpenType>(null);
  const doOpen = useCallback((type: IOpenType) => {
    startTransition(() => {
      setOpen(true);
      setOpenType(type);
    })
  }, [setOpen, setOpenType]);

  /**
   * 退出登录
   */
  const reload = useReloadMyInfo();
  const { execute } = useLogout();
  const logout = useCallback(() => {
    execute()
      .then(reload)
      .then(() => message.success('退出登录成功'))
      .then(() => doOpen('login'))
      .catch(e => message.error(e.message))
  }, [execute, reload, doOpen])

  const menu = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        key: 'profile',
        label: '修改资料',
        icon: <ProfileOutlined />,
        onClick: () => doOpen('profile')
      },
      {
        key: 'password',
        label: '修改密码',
        icon: <LockOutlined />,
        onClick: () => doOpen('password')
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        danger: true,
        label: '退出登录',
        icon: <LogoutOutlined />,
        onClick: logout
      },
    ];
    if (me.id > 0) {
      items.unshift({
        key: 'control',
        label: '进入后台',
        icon: <LaptopOutlined />,
        onClick: () => window.location.href = '/control/',
      }, {
        type: 'divider',
      })
    }
    return items;
  }, [doOpen, logout]);

  return <header className={styles.header}>
    <Flex className="container" valign="middle" scroll="hide" align="between">
      <Flex className={styles.left} valign="middle" gap={32}>
        <div className={styles.logo} onClick={() => HOME.redirect()}>
          <img src={themeConfigs.logo} alt="" />
        </div>
        <Flex gap={26}>{data.map(menu => <Category key={menu.id} {...menu} />)}</Flex>
      </Flex>
      <Flex valign="middle" gap={16}>
        <Search />
        {me.id === 0 && <Button className={styles.btn} onClick={() => doOpen('login')}>登录</Button>}
        {me.id === 0 && <Button className={styles.btn} onClick={() => doOpen('register')}>快速注册</Button>}
        {me.id > 0 && <Dropdown menu={{ items: menu }}>
          <Flex gap={6} valign="middle" className={styles.userinfo}>
            <Avatar src={me.avatar} shape="square" />
            <div className={styles.user}>
              <div className={styles.nickname}>
                <Space>{me.nickname}<CaretDownOutlined className={styles.more} /></Space>
              </div>
              <div className={styles.account}>@{me.account}</div>
            </div>
          </Flex>  
        </Dropdown>}
      </Flex>
    </Flex>
    <Modalure open={open} setOpen={setOpen}>
      {openType === 'login' && <Title name="登录"><Login go={doOpen} close={() => setOpen(false)} /></Title>}
      {openType === 'register' && <Title name="注册"><Register go={doOpen} /></Title>}
      {openType === 'profile' && <Title name="资料"><Profile close={() => setOpen(false)} /></Title>}
      {openType === 'password' && <Title name="密码"><Password go={doOpen} /></Title>}
    </Modalure>
  </header>
}