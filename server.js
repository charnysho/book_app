'use strict';

require('dotenv').config;
const pg = require('pg');

const express = require('express');
const superagent = require('superagent');
const app = express();


const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

const dbClient = new pg.Client(process.env.DATABASE_URL);

function Book(data) {
  this.title = data.title;
  this.authors = data.authors;
  this.description = data.description;
  this.image_url = parseImageUrl(data.imageLinks.smallThumbnail);
  this.isbn = `${data.industryIdentifiers[0].type} ${data.industryIdentifiers[0].identifier}`;
}

function parseImageUrl(imageUrl) {
  if(imageUrl !== '') {
    if(imageUrl.includes('http:')) {
      return imageUrl.replace(/^http:/, 'https:');
    } else {
      return imageUrl;
    }
  }
}

app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  let selectQuery = 'SELECT * FROM books;';
  return dbClient.query(selectQuery)
    .then(results => {
      if (results.rows.rowCount === 0) {
        console.log('RENDER FROM DB');
        response.render('pages/searches/new');
      } else {
        response.render('pages/index', { books: results.rows });
      }
    })
    .catch(error =>
      errorHandler(error, request, response));
});

app.get('/searches/new', (request, response) => {
  response.render('./pages/searches/new');
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
      response.render('pages/searches/show', {books: books});
    })
    .catch(error => {
      errorHandler(error, request, response);
    });
});

function errorHandler(error, request, response, next) {
  console.log(error);
  response.render('./pages/error', {error : 'Sorry something wrong'});
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
