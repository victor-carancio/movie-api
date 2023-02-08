const { StatusCodes } = require("http-status-codes");
const { CustomAPIError, BadRequestError } = require("../errors");
const connectionDB = require("../database/connection");

const getAllFavorites = async (req, res) => {
  const { id, name } = req.user;
  const [myMovies] = await connectionDB.query(
    "SELECT * FROM mymovies my LEFT JOIN movie m on my.movie_Id = m.movieId where my.user_Id = ?",
    [id]
  );

  res.status(StatusCodes.OK).json({ data: myMovies });
};

const getFavorite = async (req, res) => {
  const { id: userId } = req.user;
  const { id: movieId } = req.params;

  const [myMovie] = await connectionDB.query(
    "SELECT * FROM mymovies my LEFT JOIN movie m on my.movie_Id = m.movieId where (my.user_Id = ?) AND (my.movie_Id = ?)",
    [userId, movieId]
  );

  if (myMovie.length <= 0) {
    throw new BadRequestError("Movie is not in my movies");
  }

  res.status(StatusCodes.OK).json({ data: myMovie });
};

const createFavorite = async (req, res) => {
  const { id: userId } = req.user;
  const { id: movieId } = req.params;

  const [movie] = await connectionDB.query(
    "SELECT * from movie where movieId = ?",
    [movieId]
  );

  if (movieId != movie[0].movieId) {
    throw new BadRequestError("Invalid request");
  }

  const [myMovies] = await connectionDB.query(
    "Select * from mymovies where (movie_Id = ?) AND (user_id = ?)",
    [movieId, userId]
  );

  if (myMovies.length > 0) {
    throw new BadRequestError("Movie is already in my movies");
  }

  const [data] = await connectionDB.query(
    "INSERT INTO mymovies (user_id, movie_id) values (?,?)",
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

  const [movie] = await connectionDB.query(
    "SELECT * from mymovies where (movie_Id = ?) AND (user_Id = ?)",
    [movieId, userId]
  );

  if (movie.length <= 0) {
    throw new BadRequestError(`There is not movie added with id ${movieId}`);
  }

  const [myMovie] = await connectionDB.query(
    "UPDATE mymovies SET movieStatus = ? WHERE (movie_Id = ?) AND ( user_Id = ?)",
    [movieStatus, movieId, userId]
  );

  res.status(StatusCodes.OK).json({ msg: "movie status updated" });
};

const deleteFavorite = async (req, res) => {
  const {
    user: { id: userId },
    params: { id: movieId },
  } = req;

  const [movie] = await connectionDB.query(
    "SELECT * from mymovies where (movie_Id = ?) AND (user_Id = ?)",
    [movieId, userId]
  );

  if (movie.length <= 0) {
    throw new BadRequestError(`There is not movie added with id ${movieId}`);
  }

  const [myMovie] = await connectionDB.query(
    "Delete from mymovies where user_Id = ? AND movie_Id = ?",
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
