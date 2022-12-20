import styles from './index.module.less';
import classnames from 'classnames';
import { PropsWithChildren } from "react";

export function SideBar(props: PropsWithChildren<{ 
  title: string,
  padable?: boolean
}>) {
  return <div className={classnames('box', styles.container)}>
    <div className={styles.title}>{props.title}</div>
    <div className={classnames(styles.body, {
      [styles.padable]: props.padable
    })}>{props.children}</div>
  </div>
}