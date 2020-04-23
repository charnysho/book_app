DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    image_url VARCHAR(255),
    description TEXT,
    bookshelf VARCHAR(255)
  );

  INSERT INTO books (title, author, isbn, image_url, description, bookshelf) VALUES (
  'Dune',
  'Frank Herbert',
  'ISBN_13 9780441013593',
  'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
  'Follows the adventures of Paul Atreides, the son of a betrayed duke given up for dead on a treacherous desert planet and adopted by its fierce, nomadic people, who help him unravel his most unexpected destiny.',
  'Fantasy'
);
INSERT INTO books (title, author, isbn, image_url, description, bookshelf) VALUES (
  'What Alice Forgot',
  'Liane Moriarty',
  'ISBN_13 1101515376',
  'http://books.google.com/books/content?id=8iBGzeqj45YC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
  'Alice Love is twenty-nine, crazy about her husband, and pregnant with her first child. So imagine Alice''s surprise when she comes to on the floor of a gym (a gym! She HATES the gym) and is whisked off to the hospital where she discovers the honeymoon is truly over—she''s getting divorced, she has three kids, and she''s actually 39 years old.',
  'Fiction'
);