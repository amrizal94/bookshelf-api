import { nanoid } from 'nanoid';
// eslint-disable-next-line import/extensions
import books from './books.js';

export const addBookHandler = async (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

export const getAllBookHandler = async (request, h) => {
  const { id } = request.params;
  const isUseIdPathParam = (id !== undefined);
  if (isUseIdPathParam) {
    // eslint-disable-next-line no-use-before-define
    return getBookByIdHandler(request, h);
  }
  const isUseQueryParams = (Object.keys(request.query).length > 0);
  if (isUseQueryParams) {
    const { name, reading, finished } = request.query;
    const isReading = (reading > 0);
    const isFinished = (finished > 0);
    const bookName = (name !== undefined)
      ? books.filter((book) => book.name.toLowerCase().indexOf(name.toLowerCase()) !== -1)
      : books;
    // eslint-disable-next-line no-nested-ternary
    const dataFiltered = (reading !== undefined && finished !== undefined)
      ? bookName.filter((book) => book.reading === isReading && book.finished === isFinished)
      // eslint-disable-next-line no-nested-ternary
      : (reading !== undefined)
        ? bookName.filter((book) => book.reading === isReading)
        : (finished !== undefined)
          ? bookName.filter((book) => book.finished === isFinished)
          : bookName;
    // eslint-disable-next-line no-shadow
    const data = dataFiltered.map(({ id, name, publisher }) => ({ id, name, publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: data,
      },
    });
    response.code = 200;
    return response;
  }
  // eslint-disable-next-line no-shadow
  const data = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
  const response = h.response({
    status: 'success',
    data: {
      books: data,
    },
  });
  response.code = 200;
  return response;
};

// eslint-disable-next-line consistent-return
export const getBookByIdHandler = async (request, h) => {
  const { id } = request.params;
  const data = books.filter((book) => book.id === id);
  if (data.length > 0) {
    const response = h.response({
      status: 'success',
      data: {
        book: data[0],
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// eslint-disable-next-line consistent-return
export const editBookByIdHandler = async (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index < 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  const currentreadPage = readPage || books[index].readPage;
  const currentPageCount = pageCount || books[index].pageCount;
  if (currentreadPage > currentPageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    const finished = (currentPageCount === currentreadPage);
    const updatedAt = new Date().toISOString();
    books[index] = {
      ...books[index],
      name,
      year: year || books[index].year,
      author: author || books[index].author,
      summary: summary || books[index].summary,
      publisher: publisher || books[index].publisher,
      pageCount: pageCount || books[index].pageCount,
      readPage: readPage || books[index].readPage,
      reading: reading || books[index].reading,
      finished,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal diperbarui',
  });
  response.code(500);
  return response;
};

export const deleteBookByIdHandler = async (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
