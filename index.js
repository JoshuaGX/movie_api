const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require("uuid"),
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
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Code Red - Sorry, something is broken!');
});


// GET section for all movie data, single movie data, genre data, and director data
app.get('/movies', (req, res) => {
    res.send("Successful request returning all data on movies.");
});
app.get("/movies/:title", (req, res) => {
  res.send("Successful request returning single movie data.");
});

app.get("/genre/:name", (req, res) => {
  res.send("Successful request returning movie genre data.");
});

app.get("/director/:name", (req, res) => {
  res.send("Successful request returning director data.");
});


// User section for user registration, removal of registration, adding user information, and adding/removing movies for users
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.username) {
    const message = "Missing username in request";
    res.status(400).send(message);
  } else {
    res.send("User successfully added.");
  }
});

app.put("/users/:username/:password/:email/:dateofbirth", (req, res) => {
  res.send("User information updated.");
});

app.delete("/users/:username", (req, res) => {
  res.send("User successfully deleted from registry.");
});

app.post("/favorites/:username/:title", (req, res) => {
  res.send("add favorite movie by user.");
});

app.delete("/favorites/:username/:title", (req, res) => {
  res.send("Movie successfully deleted from favorites.");
});

app.listen(8080);
