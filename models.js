const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  genre:    [{type:mongoose.Schema.Types.ObjectId, ref:"genre"}],
  director:  [{type:mongoose.Schema.Types.ObjectId, ref:"director"}],
  ImageUrl: String,
});

let userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  birthday: Date,
  favoritesMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movie' }]
});

let directorSchema = mongoose.Schema({
  name: {type: String, required: true},
  bio: {type: String, required: true},
  birthday: Date,
});

let genreSchema = mongoose.Schema({
    name: { type: String, required: true},
    description:{ type: String, required: true}
});

let movie = mongoose.model("movie",movieSchema)
let user = mongoose.model("user",userSchema)
let director = mongoose.model("director", directorSchema);
let genre = mongoose.model("genre", genreSchema)

module.exports.movie = movie;
module.exports.user = user;
module.exports.director = director;
module.exports.genre = genre;