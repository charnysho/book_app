'use strict';

require('dotenv').config;

const express = require('express');
const superagent = require('superagent');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

function Book(data) {
  this.title = data.title;
  this.authors = data.authors;
  this.description = data.description;
  this.image_url = parseImageUrl(data.imageLinks.smallThumbnail);
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
  response.render('./pages/index');
});

app.get('/searches/new', (request, response) => {
  response.render('./pages/searches/new');
});

app.post('/searches', (request, response) => {
  console.log(request.body);
  const searchInput = request.body.searchInput;
  const searchBy = request.body.searchBy;
  console.log(searchInput);
  console.log(searchBy);
  let apiSearchTerm = (searchBy === 'title') ? 'intitle:' : 'inauthor:';
  const api_url = `https://www.googleapis.com/books/v1/volumes?q=${searchInput}+${apiSearchTerm}`;
  console.log(api_url);
  superagent.get(api_url)
    .then(booksResponse => {
      console.log('RESPONSE');
      const data = booksResponse.body.items;
      const books = [];
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

app.listen(PORT, () => {
  console.log('App is up on port : ' + PORT);
});
