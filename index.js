const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const morgan = require('morgan');
const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');

const movies = Models.movie;
const users = Models.user;
const directors = Models.director;
const genres = Models.genre;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// logging

app.use(morgan('common'));
app.use(bodyParser.json());

// GET requests

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/movies', (req, res) => {
  movies.find()
    .then((moviesSearch) => {
      res.status(201).json(moviesSearch);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:title', (req, res) => {
  movies.findOne({ title: req.params.title })
  .then((usermovie) => {
    res.json(usermovie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get("/directors",(req,res)=>{
  directors.find()
  .then((directorSearch) => {
    res.status(201).json(directorSearch);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/directors/:name',(req,res)=>{
  directors.findOne({ name: req.params.name })
  .then((nameDirector) => {
    res.json(nameDirector);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
}); 

app.get('/genres',(req,res)=>{
  genres.find()
  .then((genreSearch) => {
    res.status(201).json(genreSearch);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/genres/:name', (req, res) => {
  genres.findOne({ name: req.params.name })
    .then ((infoGenre) => {
      req.json(infoGenre);
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

app.post('/users', (req, res) => {
  users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        users
          .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday
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

// Get a user by username

app.get('/users/:username', (req, res) => {
  users.findOne({ username: req.params.username })
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

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
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

app.post('/users/:username/favorites/:movieID', (req, res) => {
  users.findOneAndUpdate({ username: req.params.username }, {
    $push: { favoriteMovies: req.params.movieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
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

app.delete('/users/:username/favorites/:movie',(req,res)=>{
  users.findOneAndRemove({ favoritesMovies: req.params.favoritesMovies })
  .then((favMov) => {
    if (!favMov) {
      res.status(400).send(req.params.favoritesMovies + ' was not found');
    } else {
      res.status(200).send(req.params.favoritesMovies + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/users/:username/favorites/',(req,res)=>{
  movies.favorites
  .find()
  .then((favoritesMovies) => {
    res.status(201).json(favoritesMovies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Delete a user by username

app.delete('/users/:Username', (req, res) => {
  users.findOneAndRemove({ username: req.params.username })
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

app.get('/documenation.html', (req, res) => {
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