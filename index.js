const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const morgan = require('morgan');
const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');
let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport');

const movies = Models.Movie;
const users = Models.User;
const directors = Models.Director;
const genres = Models.Genre;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// logging

app.use(morgan('common'));
app.use(bodyParser.json());


// GET requests

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  movies.find()
    .then((moviesSearch) => {
      res.status(201).json(moviesSearch);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  movies.findOne({ Title: req.params.Title })
  .then((usermovie) => {
    res.json(usermovie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/directors', passport.authenticate('jwt', {session: false}), (req,res)=>{
  directors.find()
  .then((directorSearch) => {
    res.status(201).json(directorSearch);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/directors/:Name', passport.authenticate('jwt', {session: false}), (req,res)=>{
  directors.findOne({ Name: req.params.Name })
  .then((nameDirector) => {
    res.json(nameDirector);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
}); 

app.get('/genres', passport.authenticate('jwt', {session: false}), (req,res)=>{
  genres.find()
  .then((genreSearch) => {
    res.status(201).json(genreSearch);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/genres/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  genres.findOne({ 'Name': req.params.Name })
    .then ((nameGenres) => {
      res.json(nameGenres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a user

/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

app.post('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
  users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
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


// Get all users

app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
  users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username

app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
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
/* We´ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/

app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  users.findOneAndUpdate({ Username: req.params.Username }, 
    { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
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

// Add a movie to a user's list of favorites

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

// Remove a movie from a user's list of favorites

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

// Delete a user by username

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

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});