'use strict';

require('dotenv').config;

const express = require('express');
const superagent = require('superagent');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

function Book(data) {
  this.search = data;
  // this.title = data.title;
  // this.author = data.author;
  // this.description = data.description;
}

let books = [];

app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.render('./pages/index');
});

app.post('/search', (request, response) => {
  // response.render('./new.ejs', { root: './public' });
  console.log(request.body.search);

  let book = new Book(request.body.search);
  // book.search = request.body.search;
  books.push(book);
  console.log(books);
  response.render('./pages/index', { books: books, });

});

// function handleBooks(request, response) {
//   response.render('index');
  // console.log(request);
  // const searchInput = request.query;
  // const api_url = `https://www.googleapis.com/books/v1/volumes?q=${searchInput}&callback=handleResponse`;
  // superagent.get(api_url)
  //   .then(booksResponse => {
  //     console.log('RESPONSE');
  //     const data = booksResponse.body;
  //     console.log(data);
  //     response.send('Hi');
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });
// }

// app.get('/', handleBooks);
app.listen(PORT, () => {
  console.log('App is up on port : ' + PORT);
});
