const { CustomAPIError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const connectionDB = require("../database/connection");

const getAllMovies = async (req, res) => {
  const [movies] = await connectionDB.query("SELECT * FROM movie");
  const moviesSort = [...movies].sort((a, b) => (a.title < b.title ? -1 : 1));
  res.status(StatusCodes.OK).json({ data: moviesSort });
};

const searchMovie = async (req, res) => {
  const { title, director, actor } = req.query;
  const objectQuery = {
    title: `title LIKE '%%'`,
    director: `director LIKE '%%'`,
    actor: `star1 LIKE '%%' OR star2 LIKE '%%' OR star3 LIKE '%%' OR star4 LIKE '%%'`,
  };

  if (title) {
    objectQuery.title = `title LIKE '%${title}%'`;
  }
  if (director) {
    objectQuery.director = `director LIKE '%${director}%'`;
  }
  if (actor) {
    objectQuery.actor = `star1 LIKE '%${actor}%' OR star2 LIKE '%${actor}%' OR star3 LIKE '%${actor}%' OR star4 LIKE '%${actor}%'`;
  }

  const queryStr = `SELECT * FROM movie Where (${objectQuery.title}) AND (${objectQuery.director}) AND (${objectQuery.actor})`;

  const [data] = await connectionDB.query(queryStr);

  res.status(StatusCodes.OK).json({ movies: data, nbHits: data.length });
};

module.exports = { getAllMovies, searchMovie };
