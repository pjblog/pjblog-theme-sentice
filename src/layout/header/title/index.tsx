import styles from './index.module.less';
import { Fragment, PropsWithChildren } from "react";

export function Title(props: PropsWithChildren<{ name: string }>) {
  return <Fragment>
    <div className={styles.title}>{props.name}</div>
    {props.children}
  </Fragment>
}