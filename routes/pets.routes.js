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

// /:petId ---> isso significa que pode vir escrito QUALQUER COISA na URL
router.get('/:petId', (req, res) => {
  const { petId } = req.params;

  Pet.findById(petId).populate('owner')
    .then(petFromDatabase => {
      console.log(petFromDatabase)
      res.render('petDetail', { pet: petFromDatabase });
    });
});

module.exports = router;