const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://web4200:de53zYlMC2bg5lHh@cluster0.8fyqb.mongodb.net/tracker?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const intakeSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['dairy', 'protein', 'vegetables', 'fruits', 'grains']
  },
  food: {
    type: String,
    required: true
  },
  serving: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Intake = mongoose.model('Intake', intakeSchema);

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  encryptedPassword: {
    type: String,
    required: true
  }
});

userSchema.methods.setEncryptedPassword = function (plainPassword, callback) {
  bcrypt.hash(plainPassword, 12).then(hash => {
    this.encryptedPassword = hash;
    callback();
  });
};

userSchema.methods.verifyPassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
    callback(result);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = {
  Intake: Intake,
  User: User
};