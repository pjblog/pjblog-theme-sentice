const path = require('path');
const clientDictionary = path.resolve(__dirname, 'dist', 'ssr', 'client');
const manifestFileName = path.resolve(clientDictionary, 'manifest.json');
const PKG = require('./package.json');

module.exports = (state) => {
  return async (ctx, next) => {
    const { getAssets } = await import('@codixjs/vite');
    const render = await import('./dist/ssr/server/server.mjs?version=' + PKG.version);
    const assets = await getAssets(
      '/', 
      'src/entries/client.tsx', 
      clientDictionary,
      require(manifestFileName)
    );
    const req = ctx.req;
    req.HTMLAssets = assets;
    req.HTMLStates = state;
    const [matched, stream] = render.default.middleware(req);
    if (!matched) return await next();
    ctx.set('Content-Type', 'text/html; charset=utf-8');
    ctx.body = stream;
  }
}