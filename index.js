const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  app = express();

const Movies = Models.Movie;
const Users = Models.User;

const passport = require('passport');
require('./passport');

const cors = require('cors');
app.use(cors());

var allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null,true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn't found on the list of allowed allowedOrigins
    var message= 'The CORS policy for this application does not allow access from origin ' + origin;
    return callback(new Error(message ), false);
  }
  return callback(null, true);
  }
}));

const { check, validationResult } = require('express-validator');

// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true,})
mongoose.connect('mongodb+srv://Sarofar:lotris39@cluster0-b3eqq.azure.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true,})

app.use(morgan('common'));
app.use(bodyParser.json());

var auth = require('./auth')(app);

app.get("/", (req, res) => {
  res.send("Welcome to myFlixDB!");
});

app.get('/movies', passport.authenticate('jwt', { session: false }), function(req, res) {
    Movies.find()
    .then(function(movies) {
        res.status(201).json(movies)
    })
    .catch(function(err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});


app.get('/movies/:Title', function(req, res) {
    Movies.findOne({ Title : req.params.Title })
    .then(function(movie) {
      res.json(movie)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });


app.get('/movies/genres/:Name', (req, res) => {
    Movies.findOne({
        'Genre.Name' : req.params.Name
    })
    .then(function(movies) {
      res.json(movies.Genre)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });


app.get("/movies/directors/:Name", (req, res) => {
    Movies.findOne({
        'Director.Name' : req.params.Name
    })
    .then(function(movies) {
      res.json(movies.Director)
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

app.post('/users',
  [check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()], function(req, res) => {

  var errors = validationResult(req);

  if (!errors.IsEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username : req.body.Username })
    .then(function(user) {
        if (user) {
            return res.status(400).send(req.body.Username + "already exists");
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: hashedPassword,
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
        res.status(500).send("Error: " + error);
    });
});


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

app.put('/users/:Username', function(req, res) {
    Users.findOneAndUpdate({ Username : req.params.Username }, { $set :
        {
            Username : req.body.Username,
            Password : req.body.Password,
            Email : req.body.Email,
            Birthday : req.body.Birthday
        }},
        { new : true },
        function(err, updatedUser) {
            if(err) {
                console.error(err);
                res.status(500).send("Error: " +err);
            } else {
                res.json(updatedUser)
            }
        })
    });


app.post('/users/:Username/Movies/:MovieID', function(req, res) {
    Users.findOneAndUpdate({ Username : req.params.Username }, {
      $push : { FavoriteMovies : req.params.MovieID }
    },
    { new : true },
    function(err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
  });


app.delete('/users/:Username/Movies/:MovieID', function(req, res) {
    Users.findOneAndUpdate({ Username : req.params.Username }, {
        $pull : { FavoriteMovies : req.params.MovieID }
      },
      { new : true },
      function(err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser)
        }
      })
    });

app.delete('/users/:Username', function(req, res) {
    Users.findOneAndRemove({ Username: req.params.Username })
    .then(function(user) {
        if (!user) {
            res.status(400).send(req.params.Username + " was not found");
        } else {
            res.status(200).send(req.params.Username + " was deleted.");
        }
    })
    .catch(function(err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

app.use(express.static('public'));

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
  console.log("Listening on Port 3000");
});
