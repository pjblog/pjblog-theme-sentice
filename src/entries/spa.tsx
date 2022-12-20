import '../style.less';
import React from 'react';
import createNewRouters from '../pages';
import { Application, PopstateHistoryMode } from '@codixjs/codix';
import { createRoot } from 'react-dom/client';

const app = new Application(PopstateHistoryMode, import.meta.env.BASE_URL);
export const routers = createNewRouters(app);
const { Bootstrap } = app.build();
const react = createRoot(document.getElementById('root'));

react.render(<Bootstrap pathes={routers}>404 Not Found</Bootstrap>);