const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  app = express();

  const mongoose = require('mongoose');
  const Models = require('./models.js');

  const Movies = Models.Movie;
  const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true});

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

//Add a user
/* We’ll expect JSON in this format
{
 ID : Integer,
 Username : String,
 Password : String,
 Email : String,
 Birthday : Date
}*/
app.post('/users', function(req, res) {
  Users.findOne({ Username : req.body.Username })
  .then(function(user) {
    if (user) {
      return res.status(400).send(req.body.Username + "already exists");
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(function(user) {res.status(201).json(user) })
      .catch(function(error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      })
    }
  }).catch(function(error) {
    console.error(error);
    res.status(500).send("Error: " + error)
  });
});

// Get all users
app.get('/users', function(req, res) {

  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Get a user by Username
app.get('/users/:Username', function(req, res) {
  Users.findOne({ Username : req.params.Username })
  .then(function(user) {
    res.json(user)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
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
