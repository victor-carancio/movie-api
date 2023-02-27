const { StatusCodes } = require("http-status-codes");
const { CustomAPIError, BadRequestError } = require("../errors");
const { connectionPgDB } = require("../database/connection");

const getAllFavorites = async (req, res) => {
  const { id, name } = req.user;
  const response = await connectionPgDB.query(
    "SELECT * FROM mymovies my LEFT JOIN movie m on my.movie_Id = m.movieId where my.user_Id = $1",
    [id]
  );

  res.status(StatusCodes.OK).json({ data: response.rows });
};

const getFavorite = async (req, res) => {
  const { id: userId } = req.user;
  const { id: movieId } = req.params;

  const myMovie = await connectionPgDB.query(
    `SELECT * FROM mymovies my LEFT JOIN movie m on my.movie_Id = m.movieId where (my.user_Id = ${userId}) AND (my.movie_Id = ${movieId})`
  );

  if (myMovie.rows.length <= 0) {
    throw new BadRequestError("Movie is not in my movies");
  }

  res.status(StatusCodes.OK).json({ data: myMovie.rows });
};

const createFavorite = async (req, res) => {
  const { id: userId } = req.user;
  const { id: movieId } = req.params;

  const movie = await connectionPgDB.query(
    "SELECT * from movie where movieId = $1",
    [movieId]
  );

  if (movie.rows.length <= 0) {
    throw new BadRequestError("Invalid request");
  }

  const myMovies = await connectionPgDB.query(
    "Select * from mymovies where (movie_Id = $1) AND (user_id = $2)",
    [movieId, userId]
  );

  if (myMovies.rows.length > 0) {
    throw new BadRequestError("Movie is already in my movies");
  }

  await connectionPgDB.query(
    "INSERT INTO mymovies (user_id, movie_id) values ($1,$2)",
    [userId, movieId]
  );

  res.status(StatusCodes.CREATED).json({ msg: "Added to my movies" });
};

const updateFavorite = async (req, res) => {
  const {
    body: { movieStatus },
    user: { id: userId },
    params: { id: movieId },
  } = req;

  if (
    movieStatus !== "watched" &&
    movieStatus !== "plan to watch" &&
    movieStatus !== "-"
  ) {
    throw new CustomAPIError(
      "Movie status just can be watched, plan to watch or - "
    );
  }

  const movie = await connectionPgDB.query(
    "SELECT * from mymovies where (movie_Id = $1) AND (user_Id = $2)",
    [movieId, userId]
  );

  if (movie.rows.length <= 0) {
    throw new BadRequestError(`There is not movie added with id ${movieId}`);
  }

  const myMovie = await connectionPgDB.query(
    "UPDATE mymovies SET movieStatus = $1 WHERE (movie_Id = $2) AND ( user_Id = $3)",
    [movieStatus, movieId, userId]
  );

  res.status(StatusCodes.OK).json({ msg: "movie status updated" });
};

const deleteFavorite = async (req, res) => {
  const {
    user: { id: userId },
    params: { id: movieId },
  } = req;

  const movie = await connectionPgDB.query(
    "SELECT * from mymovies where (movie_Id = $1) AND (user_Id = $2)",
    [movieId, userId]
  );

  if (movie.rows.length <= 0) {
    throw new BadRequestError(`There is not movie added with id ${movieId}`);
  }

  const myMovie = await connectionPgDB.query(
    "Delete from mymovies where user_Id = $1 AND movie_Id = $2",
    [userId, movieId]
  );

  res.status(StatusCodes.OK).json({ msg: "Movie deleted from mymovies" });
};

module.exports = {
  getAllFavorites,
  getFavorite,
  createFavorite,
  updateFavorite,
  deleteFavorite,
};
