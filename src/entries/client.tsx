import '../style.less';
import 'antd/dist/reset.css';
import { Application, PopstateHistoryMode } from '@codixjs/codix';
import createRouters from '../pages';
import { hydrateRoot } from 'react-dom/client';

const app = new Application(PopstateHistoryMode, import.meta.env.BASE_URL);
export const routers = createRouters(app);
const { Bootstrap } = app.build();

hydrateRoot(
  document.getElementById('root'),
  <Bootstrap pathes={routers}>404 Not Found</Bootstrap>
);
