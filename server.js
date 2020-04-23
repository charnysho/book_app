'use strict';

require('dotenv').config();
const pg = require('pg');

const express = require('express');
const superagent = require('superagent');
const methodOverride = require('method-override');
const app = express();


const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(methodOverride('_method'));

const dbClient = new pg.Client(process.env.DATABASE_URL);

function Book(data) {
  this.title = data.title;
  this.authors = data.authors;
  this.description = data.description;
  this.image_url = parseImageUrl(data.imageLinks.smallThumbnail);
  this.isbn = `${data.industryIdentifiers[0].type} ${data.industryIdentifiers[0].identifier}`;
  console.log(this);
}

function parseImageUrl(imageUrl) {
  if (imageUrl.includes('http:')) {
    return imageUrl.replace(/^http:/, 'https:');
  } else {
    return imageUrl;
  }
}

app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  let selectQuery = 'SELECT * FROM books;';
  return dbClient.query(selectQuery)
    .then(results => {
      if (results.rowCount === 0) {
        console.log('RENDER FROM DB');
        response.render('pages/searches/new');
      } else {
        response.render('pages/index', { books: results.rows, count: results.rowCount });
      }
    })
    .catch(error =>
      errorHandler(error, request, response));
});

app.get('/searches/new', (request, response) => {
  response.render('./pages/searches/new');
});

app.get('/books', (request, response) => response.send('no id present'));

app.get('/books/:id', (request, response) => {
  const bookId = request.params.id; // not onoly do we want to attach data, but we want influence our routing.

  request.query; // url query strings : ?key=value
  request.body; // comes from a more integrated attachment, more data that has specfic types and we might hidden.

  let selectQuery = `SELECT * FROM books WHERE id=$1;`;
  let selectValues = [bookId];

  dbClient.query(selectQuery, selectValues)
    .then(data => {
      response.send('In Progress');
    })
    .catch(error => errorHandler(error, request, response));
});

app.post('/searches', (request, response) => {
  const searchInput = request.body.searchInput;
  const searchBy = request.body.searchBy;
  let apiSearchTerm = (searchBy === 'title') ? 'intitle:' : 'inauthor:';
  const api_url = `https://www.googleapis.com/books/v1/volumes?q=${searchInput}+${apiSearchTerm}`;
  superagent.get(api_url)
    .then(booksResponse => {
      console.log('RESPONSE');
      const data = booksResponse.body.items;
      let books = [];
      data.map(item => books.push(new Book(item.volumeInfo)));
      response.render('pages/searches/show', { books: books });
    })
    .catch(error => {
      errorHandler(error, request, response);
    });
});

app.post('/books', (request, response) => {
  const { title, author, description, isbn, image_url, bookshelf } = request.body;

  let addBookSQL = `INSERT INTO books (title, author, description, isbn, image_url, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  let addBookValues = [title, author, description, isbn, image_url, bookshelf];

  dbClient.query(addBookSQL, addBookValues)
    .then(data => {
      const templateData = { book: data.rows[0] };
      response.render('pages/details', templateData);
    })
    .catch(error => errorHandler(error, request, response));
});

// We want the ability to update a resource
app.put('/books/:id', (request, response) => {
  const bookId = request.params.id;
  const { title, author, description, image_url, isbn, bookshelf } = request.body;

  // query the db for book that have bookId

  let SQL = `UPDATE books SET title=$1, author=$2, description=$3, image_url=$4, isbn=$5, bookshelf=$6 WHERE id=$7 RETURNING *`;
  let values = [title, author, description, image_url, isbn, bookshelf, bookId];

  // Use SQL UPDATE WHERE to modify an the row
  dbClient.query(SQL, values)
    .then(data => {
      // send back he new row.
      response.send(data.rows);
    })
    .catch(error => errorHandler(error, request, response));
});

function errorHandler(error, request, response, next) {
  console.log(error);
  response.render('./pages/error', { error: 'Sorry something wrong' });
}

dbClient.connect(err => {
  if (err) {
    console.log('ERROR: ' + err);
  } else {
    app.listen(PORT, () => {
      console.log('Server is running on PORT: ' + PORT);
    });
  }
});