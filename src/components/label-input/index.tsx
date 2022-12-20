import styles from './index.module.less';
import { Button, Input, InputProps, ButtonProps } from 'antd';
import { PropsWithChildren, PropsWithoutRef } from 'react';

interface IProps extends InputProps{
  title: string,
}

export function LabelInput(props: PropsWithoutRef<IProps>) {
  const { title, ...extras } = props;
  return <label className={styles.container}>
    <Input {...extras} size="large" />
    <span className={styles.dot}>{title}</span>
  </label>
}

LabelInput.Password = function(props: PropsWithoutRef<IProps>) {
  const { title, ...extras } = props;
  return <label className={styles.container}>
    <Input {...extras} type="password" size="large" />
    <span className={styles.dot}>{title}</span>
  </label>
}

LabelInput.Button = function(props: PropsWithChildren<ButtonProps>) {
  const { children, ...extras } = props;
  return <Button {...extras} block size="large" type="primary" className={styles.button}>{children}</Button>
}