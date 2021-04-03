require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const homeRoutes = require('./routes/home.routes');
const authRoutes = require('./routes/auth.routes')
const petsRoutes = require('./routes/pets.routes');

const sessionConfig = require('./config/session.config');

const app = express();

// Configurar o express-session (cookie & session)
sessionConfig(app);

// Estabalecendo conexão com o nosso banco de dados MongoDB
require('./config/mongodb.config');

// Dentro da pasta public é onde se encontram os arquivos estáticos do projeto
app.use(express.static('public'));

// Configurar Body parser para capturar informações de Formulários que são enviados pelo corpo da requisição
app.use(express.urlencoded({ extended: true }));

// Configurações do HBS
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

// Configuração das rotas do express

// HomeRoutes e AuthRoutes são rotas PUBLICAS
app.use('/', homeRoutes);
app.use('/', authRoutes);

// Essa callback dentro do app.use vai ser chamada em TODOS os requests que chegarem aqui.
// BLOQUEADOR DE REQUESTS (FILTRO)
app.use((req, res, next) => {
  if (req.session.currentUser) {
    return next();
  }

  res.redirect('/login');
});

// PetsRoutes são rotas PROTEGIDAS
app.use('/pets', petsRoutes);

// catch 404 and render a not-found.hbs template
app.use((req, res, next) => {
  res.status(404);
  res.render('not-found', { layout: false });
}); // SE CAIR AQUI DENTRO É PORQUE O USUARIO DIGITOU UM ROTA QUE NAO EXISTE NO APP

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error', { layout: false });
  }
}); // SE TIVERMOS ALGUM ERRO NA APLICACAO, ELE CAI AQUI DENTRO

app.listen(process.env.PORT, () => console.log(`App rodando na porta ${process.env.PORT}`));
