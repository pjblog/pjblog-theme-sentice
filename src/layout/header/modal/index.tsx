import styles from './index.module.less';
import { Modal, ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';
import { useThemeConfigs } from '@pjblog/hooks';
import { ThemeConfigs } from '../../../utils';

const tokens = {
  token: {
    borderRadius: 2,
    fontSize: 12,
  }
}

export function Modalure(props: PropsWithChildren<{
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>) {
  const themeConfigs = useThemeConfigs<ThemeConfigs>();
  return <Modal 
    title={null} 
    open={props.open} 
    onOk={null} 
    onCancel={() => props.setOpen(false)} 
    className={styles.modal} 
    width={398}
    footer={null}
  >
    <div className={styles.logo}><img src={themeConfigs.logo} alt="" /></div>
    <ConfigProvider theme={tokens}>
      {props.children}
    </ConfigProvider>
  </Modal>
}