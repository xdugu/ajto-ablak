/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */

import '@angular/localize/init';
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID} from '@angular/core';

import 'localstorage-polyfill';

global.localStorage = localStorage;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/ajto-ablak/browser');

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/', (_, res) => {
    console.log('Should not be here redirecting languages');
    res.redirect('/hu');
  });

  server.get('/*', (req, res) => {
    const langMatch = req.path.match(/\/(.{2})/);

    if (langMatch){
      res.render(join(distFolder, `${langMatch[1]}/index.html`), {
        req,
        providers: [{ provide: APP_BASE_HREF, useValue: langMatch[0]},
          {provide: 'host', useValue: getHost(req)}, {provide: 'request', useValue: req},
          {provide: LOCALE_ID, useValue: langMatch[1]}]
      });
    }
    else {
      res.redirect('/');
    }

  });

  return server;
}

function getHost(req: any): string{
  const edgeEvent = req.get('x-edge-event');
  if (edgeEvent){
     console.log('Got edge event');
     const decodedHeader = JSON.parse(decodeURIComponent(edgeEvent));
     // console.log(decodedHeader);
     return decodedHeader.Records[0].cf.request.headers.host[0].value;
  }
  else{
    return req.get('host');
  }

}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });

}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
