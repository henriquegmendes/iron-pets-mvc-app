const express = require('express');

const Pet = require('../models/Pet');
const User = require('../models/User');

const router = express();

router.get('/', (req, res) => {
  const { petName } = req.query;

  Pet.find({ owner: '604abb4e7d9820011720cb45', name: { $regex: new RegExp(petName, 'i') } })
    .then(petsFromDatabase => {
      res.render('pets', { pets: petsFromDatabase });
    });
});

// Entregar o HTML com o formulario de cadastro do novo pet
router.get('/new', (req, res) => {
  res.render('newPet');
});

// /:petId ---> isso significa que pode vir escrito QUALQUER COISA na URL
router.get('/:petId', (req, res) => {
  const { petId } = req.params;

  Pet.findById(petId).populate('owner')
    .then(petFromDatabase => {
      console.log(petFromDatabase)
      res.render('petDetail', { pet: petFromDatabase });
    });
});

// Receber os dados do FORM para inserir um novo PET no banco
router.post('/new', (req, res) => {
 // BODY ou CORPO DA REQUISICAO!!
  const { petName, petImage, petSpecies, petBirthDate } = req.body;

  const newPet = {
    name: petName,
    image: petImage,
    species: petSpecies,
    birthDate: petBirthDate,
    owner: '604abb4e7d9820011720cb45',
  };

  Pet.create(newPet)
    .then(() => {
      res.redirect('/pets');
    })
    .catch(error => console.log(error));

});

module.exports = router;