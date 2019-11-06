const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  models = require("./models"),
  User = require("./User"),
  passport = require("passport"),
  cors = require("cors"),
  { check, validationResult } = require("express-validator");
require("./passport");

const Movies = models.Movie;
const Users = models.User;

mongoose
  .connect(
    "mongodb+srv://Sarofar:myFlixDB01@cluster0-b3eqq.azure.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  )
  .catch(err => console.log(err.message));

const app = express();
app.use(cors());
app.use(bodyParser.json());

const auth = require("./auth")(app);

app.use(morgan("common"));
app.use(express.static("public"));
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something went wrong");
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix! Your customized movie platform.");
});

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find();
      if (!movies.length) return res.status(400).send("No movies yet");

      res.json(movies);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.get(
  "/movies/featured",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const featuredMovies = await Movies.find({ Featured: true });
      if (!featuredMovies.length)
        return res.status(400).send("No featured movies yet");

      res.json(featuredMovies);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const foundMovie = await Movies.findOne({ Title: req.params.title });
      if (!foundMovie)
        return res.status(400).send(`${req.params.title} not found`);

      res.json(foundMovie);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.get(
  "/movies/:title/genre",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const genreOfMovie = await Movies.findOne({
        Title: req.params.title
      }).select("Genre");
      if (!genreOfMovie)
        return res.status(400).send(`${req.params.title} not found`);

      res.json(genreOfMovie);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.get(
  "/movies/genres/:genre",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const moviesWithGenre = await Movies.find({
        "Genre.Name": req.params.genre
      });
      if (!moviesWithGenre)
        return res
          .status(400)
          .send(`No movies found with Genre: ${req.params.genre}`);

      res.json(moviesWithGenre);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.get(
  "/movies/:title/director",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const directorOfMovie = await Movies.findOne({
        Title: req.params.title
      }).select("Director");
      if (!directorOfMovie)
        return res.status(400).send(`${req.params.title} not found`);

      res.json(directorOfMovie);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await Users.find();
      if (!users.length) return res.status(400).send("No users yet");

      res.json(users);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const foundUser = await Users.findOne({ Username: req.params.username });
      if (!foundUser)
        return res.status(400).send(`${req.params.username} not found`);

      res.json(foundUser);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.post(
  "/users",
  [
    check("username", "username is required").isLength({ min: 5 }),
    check(
      "username",
      "username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("password", "password is required")
      .not()
      .isEmpty(),
    check("email", "email does not appear to be valid").isEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { username, password, email, birth } = req.body;

      const foundUser = await Users.findOne({ Username: req.body.username });
      if (foundUser)
        return res.status(400).send(`${req.body.username} already exists`);

      const hashedPassword = Users.hashPassword(password);
      const newUser = await Users.create(
        new User(username, hashedPassword, email, birth, [])
      );

      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.put(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  [
    check("username", "username is required").isLength({ min: 5 }),
    check(
      "username",
      "username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("password", "password is required")
      .not()
      .isEmpty(),
    check("email", "email does not appear to be valid").isEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { username, password, email, birth } = req.body;
      const hashedPassword = Users.hashPassword(password);
      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.username },
        { $set: new User(username, hashedPassword, email, birth, []) },
        { new: true }
      );
      if (!updatedUser)
        return res.status(400).send(`${req.params.username} not found`);

      res.status(201).json(updatedUser);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.put(
  "/users/:username/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { username, movieId } = req.params;
      const updatedUser = await Users.findOneAndUpdate(
        { Username: username },
        { $push: { FavoriteMovies: movieId } },
        { new: true }
      );
      if (!updatedUser) return res.status(400).send(`${username} not found`);

      res.status(201).json(updatedUser);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.delete(
  "/users/:username/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { username, movieId } = req.params;
      const updatedUser = await Users.findOneAndUpdate(
        { Username: username },
        { $pull: { FavoriteMovies: movieId } },
        { new: true }
      );
      if (!updatedUser) return res.status(400).send(`${username} not found`);

      res.json(updatedUser);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.delete(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const deletedUser = await Users.findOneAndRemove({
        Username: req.params.username
      });
      if (!deletedUser)
        return res.status(400).send(`${req.params.username} not found`);

      res.status(200).send(`${req.params.username} was deleted.`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log("Server is listening on port " + PORT)
);
