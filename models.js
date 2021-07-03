const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {type:mongoose.Schema.Types.ObjectId, ref:'genres'},
  Director: {type:mongoose.Schema.Types.ObjectId, ref:'directors'},
  ImageUrl: String,
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoritMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }]
});

userSchema.statics.hashPassword = (Password) => {
  return bcrypt.hashSync(Password, 10);
};

userSchema.methods.validatePassword = function(Password) {
  return bcrypt.hashSync(Password, this.Password);
};

let directorSchema = mongoose.Schema({
  Name: {type: String, required: true},
  Bio: {type: String, required: true},
  Birthday: Date,
});

let genreSchema = mongoose.Schema({
    Name: { type: String, required: true},
    Description:{ type: String, required: true}
});

const Movie = mongoose.model('Movie',movieSchema)
const User = mongoose.model('User',userSchema)
const Director = mongoose.model('Director', directorSchema);
const Genre = mongoose.model('Genre', genreSchema)

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;