require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const homeRoutes = require('./routes/home.routes');
const petsRoutes = require('./routes/pets.routes');

const app = express();

// Estabalecendo conexão com o nosso banco de dados MongoDB
require('./config/mongodb.config');

// Dentro da pasta public é onde se encontram os arquivos estáticos do projeto
app.use(express.static('public'));

// Configurar Body parser para capturar informações de Formulários que são enviados pelo corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));

// Configurações do HBS
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

// Configuração das rotas do express
app.use('/', homeRoutes);
app.use('/pets', petsRoutes);

app.listen(3000, () => console.log('App rodando na porta 3000'));
