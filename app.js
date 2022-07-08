const express = require("express");
const axios = require("axios");
const app = express();
const apiKey = "cb3474c672bd70d204dd4ab6d178f560";

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// logging middleware
app.use((req, _, next) => {
  console.log("new request", req.method, req.url);
  next();
});
app.use(express.static("public"));

app.get("/", (_, res) => {
  Promise.all([
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`),
    axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
    ),
  ]).then(([moviesResponse, genresResponse]) => {
    const movies = moviesResponse.data.results;
    const genres = genresResponse.data;
    // console.log(moviesResponse.data);
    res.render("home", { movies, genres });
  });
});

app.get("/detail/:movieId", (req, res) => {
  const movieId = req.params.movieId;

  axios
    .get(
      `https://api.themoviedb.org/3/movie/${movieId}videos?api_key=${apiKey}&language=en-US`
    )
    .then((response) => {
      const movieDetail = response.data;
      // console.log(movieDetail);

      res.render("detail", { movieDetail });
    });
});

app.get("/genre/:genreId", (req, res) => {
  const genreId = req.params.genreId;

  axios
    .get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`
    )
    .then((response) => {
      const genreList = response.data.results;
      //   console.log(genreList);

      res.render("genre", { genreList });
    });
});

app.post("/header", (req, res) => {
  const value = req.body.input;
  // console.log(value);

  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${value}`
    )
    .then((response) => {
      const searchList = response.data.results;
      // console.log(searchList);
      res.render("search", { searchList });
    });
});

module.exports = app;
