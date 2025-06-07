
const express = require('express');
const bodyParser = require('body-parser');
const Book = require('./models/Book');
const sequelize = require('./database');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

sequelize.sync();

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/books', async (req, res) => {
  const books = await Book.findAll();
  res.render('books', { books });
});

app.get('/books/new', (req, res) => {
  res.render('form', { book: {}, action: '/books', method: 'POST' });
});

app.post('/books', async (req, res) => {
  const { title, author, year } = req.body;
  await Book.create({ title, author, year });
  res.redirect('/books');
});

app.get('/books/edit/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('form', { book, action: `/books/update/${book.id}`, method: 'POST' });
});

app.post('/books/update/:id', async (req, res) => {
  const { title, author, year } = req.body;
  await Book.update({ title, author, year }, { where: { id: req.params.id } });
  res.redirect('/books');
});

app.get('/books/delete/:id', async (req, res) => {
  await Book.destroy({ where: { id: req.params.id } });
  res.redirect('/books');
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
