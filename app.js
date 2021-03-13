const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');

const Pet = require('./models/Pet');
const User = require('./models/User');

const app = express();

// Estabalecendo conexão com o nosso banco de dados MongoDB
mongoose.connect(
  'mongodb://localhost:27017/pet-shop-database',
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
).then(() => console.log('Conectado com o banco de dados'));

// Dentro da pasta public é onde se encontram os arquivos estáticos do projeto
app.use(express.static('public'));

// Configurações do HBS
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/pets', (req, res) => {
  const { petName } = req.query;

  Pet.find({ owner: '604abb4e7d9820011720cb45', name: { $regex: new RegExp(petName, 'i') } })
    .then(petsFromDatabase => {
      res.render('pets', { pets: petsFromDatabase });
    });
});

// /:petId ---> isso significa que pode vir escrito QUALQUER COISA na URL
app.get('/pets/:petId', (req, res) => {
  const { petId } = req.params;

  Pet.findById(petId).populate('owner')
    .then(petFromDatabase => {
      console.log(petFromDatabase)
      res.render('petDetail', { pet: petFromDatabase });
    });
});

app.listen(3000, () => console.log('App rodando na porta 3000'));
