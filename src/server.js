// eslint-disable-next-line import/no-extraneous-dependencies
import Hapi from '@hapi/hapi';
import { config } from 'dotenv';

/** import routes */
// eslint-disable-next-line import/no-unresolved, import/extensions
import router from './router.js';

/** server use dotenv */
config();

/** server use port */
const port = process.env.PORT || 9000;

const init = async () => {
  const server = Hapi.server({
    port,
    host: 'localhost',
  });

  /** server routes */
  server.route(router);

  /** server start */
  await server.start();
  console.log(`server started at ${server.info.uri}`);
};

init();
