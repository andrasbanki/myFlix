const express = require('express'),
  morgan = require('morgan');

const app = express();

// logging

app.use(morgan('common'));
app.use(express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// GET requests

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/movies', (req, res) => {
  res.json([
    {movie1: 'fav1'},
    {movie2: 'fav2'},
    {movie3: 'fav3'},
    {movie4: 'fav4'},
    {movie5: 'fav5'},
    {movie6: 'fav6'},
    {movie7: 'fav7'},
    {movie8: 'fav8'},
    {movie9: 'fav9'},
    {movie10: 'fav10'}
  ]);
});

app.get('/documenation.html', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname
});
});

// listen for requests

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});