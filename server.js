'use strict';

require('dotenv').config;

const express = require('express');
const app = express();
// const ejs = require('ejs');

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.render('./pages/index');
});

app.listen(PORT, () => {
  console.log('App is up on port : ' + PORT);
});
