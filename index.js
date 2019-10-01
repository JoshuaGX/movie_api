const express = require('express'),
  morgan = require('morgan'),
  app = express();

let topMovies = [{
    title : 'Iron Man',
    director : 'Jon Favreau'
},
{
    title : 'The Lord of the Rings Trilogy',
    director : 'Peter Jackson'
},
{
    title : 'The Hobbit Trilogy',
    director : 'Peter Jackson'
},
{
    title : '47 Ronin',
    director : 'Carl Rinsch'
},
{
    title : 'The Last Samurai',
    director : 'Edward Zwick'
},
{
    title : 'The King\'s Speech',
    director : 'Tom Hooper'
},
{
    title : 'Guardians Of The Galaxy Vol. 1&2',
    director : 'James Gunn'
},
{
    title : 'Doctor Strange',
    director : 'Scott Derrickson'
},
{
    title : 'The Expendables',
    director : 'Sylvester Stallone'
},
{
    title : 'Ocean\'s Eleven',
    director : 'Steven Soderbergh'
}
]

app.use(morgan('common'));

app.get('/movies', function(req, res) {
    res.json(topMovies)
});

app.get('/', function(req, res) {
    res.send('Welcome to myFlix - JCG')
});

app.use(express.static('public'));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Code Red - Sorry, something is broken!');
});

app.listen(8080);
