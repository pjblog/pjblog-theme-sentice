import { Spin } from 'antd';
import { Flex } from '../flex';
export function Loading() {
  return <Flex full block align="center" valign="middle">
    <Spin spinning></Spin>
  </Flex>
}