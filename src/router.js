import { Router } from 'express';
// eslint-disable-next-line import/extensions
import * as Handler from './handler.js';

const router = Router();

/** import handler */

/** books router */
router.route('/books')
  .get(Handler.getAllBookHandler)
  .post(Handler.addBookHandler)
  .delete();

/** books router with parameter id */
router.route('/books/:id')
  .get(Handler.getBookByIdHandler)
  .put(Handler.editBookByIdHandler)
  .delete(Handler.deleteBookByIdHandler);

export default router;
