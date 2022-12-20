import Html from '../html';
import createRouters from '../pages';
import { ServerSiderRender } from '@codixjs/server';
import { extractStyle } from '@ant-design/cssinjs';

export default ServerSiderRender({
  prefix: import.meta.env.BASE_URL,
  html: Html,
  routers: createRouters,
  onAllReady(stream, obj) {
    const client = obj.client;
    const cache = obj.cache;
    stream.write(`<script>window.INITIALIZE_STATE = ${JSON.stringify(client.toJSON())}</script>${extractStyle(cache)}`);
  }
})