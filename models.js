const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre:    [{type:mongoose.Schema.Types.ObjectId, ref:'genres'}],
  Director:  [{type:mongoose.Schema.Types.ObjectId, ref:'directors'}],
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

let movie = mongoose.model('movie',movieSchema)
let user = mongoose.model('user',userSchema)
let director = mongoose.model('director', directorSchema);
let genre = mongoose.model('genre', genreSchema)

module.exports.Movie = movie;
module.exports.User = user;
module.exports.Director = director;
module.exports.Genre = genre;