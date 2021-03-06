const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const {check, validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');
require('./passport');

const movies = Models.Movie;
const users = Models.User;
const directors = Models.Director;
const genres = Models.Genre;

// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());

let auth = require('./auth.js')(app);

// GET requests

app.get('/', (req, res) => {
  res.send('Welcome to my app!!!');
});

/**
 * This method makes a call to the movies endpoint
 * and returns an array of movies objects.
 * @method getAllMovies
 * @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/movies
 * @param {func} callback - Callback queries database for all movies.
 * @returns {object} - Returns json object of all movies from the database.
 */
app.get('/movies', (req, res) => {
  movies.find({}).populate({path:'Genre', model:'Genre'}).populate({path:'Director', model: 'Director'})
    .then((moviesSearch) => {
      res.status(201).json(moviesSearch);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * This method makes a call to the movie by title endpoint
 * and returns a movie object.
 * @method getMovieByTitle
 * @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/movies/:Title
 * @param {func} callback - Callback queries database to find one movie by title.
 * @returns {object} - Returns object of requested movie from the database..
 */
app.get('/movies/:Title', (req, res) => {
  movies.findOne({ Title: req.params.Title })
  .then((usermovie) => {
    res.json(usermovie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * This method makes a call to the directors endpoint
 * and returns an array of directors objects.
 * @method getAllDirectors
 * @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/directors
 * @param {func} callback - Callback queries database for all directors.
 * @returns {object} - Returns json object of all directors from the database.
 */
app.get('/directors', (req,res)=>{
  directors.find()
  .then((directorSearch) => {
    res.status(201).json(directorSearch);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * This method makes a call to the director by name endpoint
 * and returns a director object.
 * @method getDirectorByName
 * @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/directors/:Name
 * @param {func} callback - Callback queries database to find a director by name.
 * @returns {object} - Returns object of requested director from the database..
 */
app.get('/directors/:Name', (req,res)=>{
  directors.findOne({ Name: req.params.Name })
  .then((nameDirector) => {
    res.json(nameDirector);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * This method makes a call to the genres endpoint
 * and returns an array of genres objects.
 * @method getAllGenres
 * @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/genres
 * @param {func} callback - Callback queries database for all genres.
 * @returns {object} - Returns json object of all genres from the database.
 */
app.get('/genres', (req,res)=>{
  genres.find()
  .then((genreSearch) => {
    res.status(201).json(genreSearch);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/genres/:Name', (req, res) => {
  genres.findOne({ 'Name': req.params.Name })
    .then ((nameGenres) => {
      res.json(nameGenres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
* This method makes a call to the users endpoint,
* validates the object sent through the request
* and creates a user object.
* @method registerUser
* @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/users
* @param {array} expressValidator - Validate form input using the express-validator package.
* @param {func} callback - Register the user.
* @return {object} - Returns object of newly registered user.
 */
app.post('/users',

  // Validation logic here for request
  // you can either use a chain of methods like .not().isEmpty()
  // which means "opposite of isEmpty" in plain english "is not empty"
  // or use .isLength({min:5}) which means
  //minimum value of 5 characters are only allowed

  [
    check('Username', 'Username is required').isLength({min:5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = users.hashPassword(req.body.Password);
    users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
        // If the user is found, send a response that it already exists  
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
});

/**
 * This method makes a call to the users endpoint
 * and returns an array of users objects.
 * @method getAllUsers
 * @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/users
 * @param {func} callback - Callback queries database for all users.
 * @returns {object} - Returns json object of all users from the database.
 */
app.get('/users', (req, res) => {
  users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * This method makes a call to the users by username endpoint
 * and returns a user object.
 * @method getUserByUsername
 * @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/users/:Username
 * @param {func} callback - Callback queries database to find one user by username.
 * @returns {object} - Returns object of requested user from the database..
 */
app.get('/users/:Username', (req, res) => {
  users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update a user's info, by username
/* We??ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/

/**
* Update a user's info, by username.
* @method updateUser
* @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/users/:Username
* @param {array} expressValidator - Validate form input using the express-validator package.
* @param {func} callback - Update user's info by username.
 */
app.put('/users/:Username', passport.authenticate('jwt', {session: false}),

[
  check('Username', 'Username is required').isLength({min:5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {

  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  };

  let hashedPassword = users.hashPassword(req.body.Password);

  users.findOneAndUpdate({ Username: req.params.Username }, 
    { $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/**
* This method makes a call to the users endpoint,
* and pushes the movieID in the FavoriteMovies array.
* @method addToFavorites
* @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/users/:Username/favorites/:_id
* @param {array} expressValidator - Validate form input using the express-validator package.
* @param {func} callback - Add movieID to list of favorite movies.
 */
app.post('/users/:Username/favorites/:_id', passport.authenticate('jwt', {session: false}), (req, res) => {
	users.findOneAndUpdate({Username: req.params.Username},
		{ $push: { FavoritMovies: req.params._id} },
		{new: true},
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		});
});

/**
* This method makes a call to the users edpoint,
* and deletes the movieID from the FavoriteMovies array.
* @method deleteFromFavorites
* @param {string} Endpoint - https://andrasbanki-myflixapp.herokuapp.com/users/:Username/favorites/:_id
* @param {array} expressValidator - Validate form input using the express-validator package.
* @param {func} callback - Delete movieID from the list of favorite movies.
 */
app.delete('/users/:Username/favorites/:_id', passport.authenticate('jwt', {session: false}), (req,res) => {
  users.findOneAndUpdate ({ Username: req.params.Username},
    { $pull: { FavoritMovies: req.params._id} },
    {new: true},
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/**
 * Delete request to delete a user by username
 */
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/documentation.html', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});


app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests

const port = process.env.PORT || 8080;
app.listen( port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});