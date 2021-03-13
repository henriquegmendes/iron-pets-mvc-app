const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  birthDate: { type: Date },
  active: { type: Boolean, default: true },
},
{
  timestamps: true,
});

// Mongoose criar dentro do Mongo uma coleção de "Users" que respeitem o Schema que declaramos na variável userSchema
const User = model('User', userSchema);

module.exports = User;
