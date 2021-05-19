const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');


const app = express();

// logging

app.use(morgan('common'));
app.use(bodyParser.json());

let movies = [
  {
    title: 'Any Given Sunday',
    director: 'Oliver Stone',
    genres: ['Drama', 'Sport']
  },
  {
    title: 'Donnie Brasco',
    director: 'Mike Newell',
    genres: ['Biography', 'Crime', 'Drama']
  },
  {
    title: 'Casino',
    director: 'Martin Scorsese',
    genres: ['Drama', 'Crime']
  },
  {
    title: 'Taxi Driver',
    director: 'Martin Scorsese',
    genres: ['Drama', 'Crime']
  },
  {
    title: 'The Irishman',
    director: 'Martin Scorsese',
    genres: ['Biography', 'Crime', 'Drama']
  },
  {
    title: 'The Wolf of Wall Street',
    director: 'Martin Scorsese',
    genres: ['Drama', 'Crime', 'Biography']
  },
  {
    title: 'Goodfellas',
    director: 'Martin Scorsese',
    genres: ['Drama', 'Crime', 'Biography']
  },
  {
    title: 'Reservoir Dogs',
    director: 'Quentin Tarantino',
    genres: ['Drama', 'Crime', 'Thriller']
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    genres: ['Drama', 'Crime']
  },
  {
    title: 'Four Rooms',
    director: ['Allison Anders','Alexandre Rockwell','Robert Rodriguez','Quentin Tarantino'],
    genres: ['Comedy']
  },
  {
    title: 'Jackie Brown',
    director: 'Quentin Tarantino',
    genres: ['Drama', 'Crime', 'Thriller']
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    genres: ['Drama', 'Crime']
  },
  {
    title: 'Scarface',
    director: 'Brian De Palma',
    genres: ['Drama', 'Crime']
  },
];



// GET requests

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/movies/:title', (req, res) => {
  res.json(movies.find( (movie) =>
    { return movie.title === req.params.title }));
});

app.get('/movies/genres/:genre', (req, res) => {
  res.send('You will see the genres here!');
});

app.get('/movies/director/:name', (req, res) => {
  res.send('You will see the director here!');
});

app.post('/users', (req, res) => {
  res.send('Registration successful!')
});

app.put('/users/:username', (req, res) => {
  res.send(req.params.username + ', Your profile has been updated!');
});

app.post('/users/:username/favorites', (req, res) => {
  res.send(req.params.title + ' added to your favorites!');
});

app.delete('/users/:username/favorites/:title', (req, res) => {
  res.send('You removed ' + req.params.title + ' from your favorites!');
});

app.delete('/users/:username', (req, res) => {
  res.send('You successfully deleted your profile!');
});

app.get('/documenation.html', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname
});
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