import styles from './index.module.less';
import classnames from 'classnames';
import { ICategory, createArticlesQuery } from '@pjblog/hooks';
import { createContext, PropsWithChildren, PropsWithoutRef, useCallback, useContext, useMemo, useState } from 'react';
import { Typography } from 'antd';
import { redirect, useRequestPath, useRequestQuery } from '@codixjs/codix';
import { numberic } from '../../../utils';
import { usePath } from '../../../hooks';

const CategorySelectionContext = createContext(0);
const CategorySetterProvider = createContext<React.Dispatch<React.SetStateAction<number>>>(() => {});

export function CategoryProvider(props: PropsWithChildren<{}>) {
  const [category, setCategory] = useState(0);
  return <CategorySelectionContext.Provider value={category}>
    <CategorySetterProvider.Provider value={setCategory}>
      {props.children}
    </CategorySetterProvider.Provider>
  </CategorySelectionContext.Provider>
}

export function useCategorySetter() {
  return useContext(CategorySetterProvider);
}

export function Category(props: PropsWithoutRef<ICategory>) {
  const currentPath = useRequestPath<string>();
  const currentCategory = useContext(CategorySelectionContext);
  const cid = useRequestQuery('category', numberic(0)) as number;
  const params = createArticlesQuery({ category: props.id });
  const ArticlePather = usePath('HOME');
  const isWebUrl = props.outable && props.outlink && !props.outlink.startsWith('/');
  const click = useCallback(() => {
    if (!props.outable) return ArticlePather.redirect({}, params);
    if (props.outlink && props.outlink.startsWith('/')) {
      return redirect(props.outlink);
    }
  }, [props.outable, props.outlink, params]);
  const actived = useMemo(() => {
    if (!props.outable && currentCategory > 0 && currentCategory === props.id) {
      return true;
    } else if (props.outable && !cid) {
      return currentPath === props.outlink;
    } else {
      return cid === props.id;
    }
  }, [props.outlink, currentPath, props.id, cid, props.outable, currentCategory])
  return <Typography.Link 
    className={classnames(styles.link, {
      [styles.active]: actived
    })} 
    href={isWebUrl ? props.outlink : undefined} 
    target={isWebUrl ? '_blank' : undefined} 
    onClick={isWebUrl ? undefined : click}
  >{props.name}</Typography.Link>
}