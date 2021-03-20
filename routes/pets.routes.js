const express = require('express');
const { format } = require('date-format-parse');

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
      const birthDateParsed = format(petFromDatabase.birthDate, 'YYYY-MM-DD');

      const mongoDbObject = petFromDatabase.toJSON();

      const newObject = { ...mongoDbObject, birthDate: birthDateParsed };

      const speciesValues = [
        { value: 'dog', text: 'Cachorro' },
        { value: 'cat', text: 'Gato' },
        { value: 'parrot', text: 'Papagaio' },
      ];

      const petIndex = speciesValues.findIndex((specieOption) => {
        return specieOption.value === petFromDatabase.species;
      });

      const foundSpecieValue = speciesValues[petIndex];
      speciesValues.splice(petIndex, 1);
      speciesValues.unshift(foundSpecieValue);

      res.render('petDetail', { pet: newObject, speciesValues, petSpeciesText: speciesValues[petIndex].text });
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

router.post('/edit/:petId', (req, res) => {
  const { petName, petImage, petSpecies, petBirthDate } = req.body;
  const { petId } = req.params;

  Pet.findByIdAndUpdate(petId, { name: petName, image: petImage, species: petSpecies, birthDate: petBirthDate })
    .then(() => {
      res.redirect(`/pets/${petId}`);
    })
    .catch(error => console.log(errror));

});

module.exports = router;