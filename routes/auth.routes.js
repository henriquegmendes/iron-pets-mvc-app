const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const router = express();

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  // console.log(req.body)

  const { userName, userEmail, userPassword, userBirthDate } = req. body;

  // Verificar se ele enviou as infos necessarias (todas)
  const validationErrors = {};

  if (userName.trim().length === 0) {
    validationErrors.userNameError = 'Campo é Obrigatório';
  }
  if (userEmail.trim().length === 0) {
    validationErrors.userEmailError = 'Campo é Obrigatório';
  }
  if (userPassword.trim().length === 0) {
    validationErrors.userPasswordError = 'Campo é Obrigatório';
  }
  if (userBirthDate.trim().length === 0) {
    validationErrors.userBirthDateError = 'Campo é Obrigatório';
  }

  // se houver pelo menos um erro...
  if (Object.keys(validationErrors).length > 0) {
    return res.render('signup', validationErrors); // garantir que nenhum cógigo abaixo seja executado
  }

  try {
    // Verifica se usuario já foi cadastrado anteriormente (email)
    const userFromDb = await User.findOne({ email: userEmail }); // transforma um método assíncrono em síncrono

    if (userFromDb) {
      return res.render('signup', { userEmailError: 'Este e-mail já foi cadastrado no nosso sistema. Por favor escolha outro' });
    }

    // Encriptar a senha que recebemos do usuário
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = bcrypt.hashSync(userPassword, salt);

    // Salvar usuário no banco de dado
    await User.create({
      name: userName,
      email: userEmail,
      password: encryptedPassword,
      birthDate: new Date(userBirthDate),
    });

    res.redirect('/login');
  } catch (error) {
    console.log('ERRRO NA ROTA /signup -> ', error)
  }
});

module.exports = router;
