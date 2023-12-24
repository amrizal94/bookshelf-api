import { nanoid } from 'nanoid';
// eslint-disable-next-line import/extensions
import books from './books.js';

export const addBookHandler = async (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  if (name === undefined || name === '') {
    res.status(400);
    res.json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    return res;
  }

  if (readPage > pageCount) {
    res.status(400);
    res.json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return res;
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
    res.status(201);
    res.json(
      {
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      },
    );
    return res;
  }

  res.status(500);
  res.json({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  return res;
};

export const getAllBookHandler = async (req, res) => {
  const isUseQueryParams = (Object.keys(req.query).length > 0);
  if (isUseQueryParams) {
    const { name, reading, finished } = req.query;
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
    res.status = 200;
    res.json({
      status: 'success',
      data: {
        books: data,
      },
    });
    return res;
  }
  const data = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
  res.status = 200;
  res.json({
    status: 'success',
    data: {
      books: data,
    },
  });
  return res;
};

// eslint-disable-next-line consistent-return
export const getBookByIdHandler = async (req, res) => {
  const { id } = req.params;
  const data = books.filter((book) => book.id === id);
  if (data.length > 0) {
    res.status(200);
    res.json({
      status: 'success',
      data: {
        book: data[0],
      },
    });
    return res;
  }
  res.status(404);
  res.json({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
};

// eslint-disable-next-line consistent-return
export const editBookByIdHandler = async (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index < 0) {
    res.status(404);
    res.json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    return res;
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
  } = req.body;

  if (!name || name === '') {
    res.status(400);
    res.json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    return res;
  }
  const currentreadPage = readPage || books[index].readPage;
  const currentPageCount = pageCount || books[index].pageCount;
  if (currentreadPage > currentPageCount) {
    res.status(400);
    res.json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    return res;
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
    res.status(200);
    res.json({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    return res;
  }
  res.status(500);
  res.json({
    status: 'fail',
    message: 'Buku gagal diperbarui',
  });
};

export const deleteBookByIdHandler = async (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    res.status(200);
    res.json({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    return res;
  }

  res.status(404);
  res.json({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  return res;
};
