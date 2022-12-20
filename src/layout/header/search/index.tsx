import styles from './index.module.less';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { usePath } from '../../../hooks';
import { startTransition, useState } from 'react';
import { createArticlesQuery } from '@pjblog/hooks';
import { useRequestPath, useRequestQuery } from '@codixjs/codix';
export function Search() {
  const HOME = usePath('HOME');
  const pathname = useRequestPath<string>();
  const keyword = useRequestQuery<string>('keyword');
  const [key, setKey] = useState<string>(pathname === '/' ? keyword || null : null);
  return <div className={styles.input}>
    <Input 
      bordered={false} 
      value={key}
      suffix={<SearchOutlined />} 
      placeholder="搜索" 
      onChange={e => {
        const value = e.target.value;
        if (!value && keyword) {
          setKey(null);
          HOME.redirect({});
        } else {
          setKey(value);
        }
      }}
      onPressEnter={() => startTransition(() => {
        HOME.redirect({}, createArticlesQuery({ keyword: key }))
      })}
    />
  </div>
}