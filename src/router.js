// eslint-disable-next-line import/extensions
import * as Handler from './handler.js';

export default [
  {
    method: 'POST',
    path: '/books',
    handler: Handler.addBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{id?}',
    handler: Handler.getAllBookHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: Handler.editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: Handler.deleteBookByIdHandler,
  },
];
