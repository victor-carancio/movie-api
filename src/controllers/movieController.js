const { CustomAPIError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { connectionPgDB } = require("../database/connection");

const getAllMovies = async (req, res) => {
  const { rows } = await connectionPgDB.query("SELECT * FROM movie");
  // console.log(rows);

  const moviesSort = [...rows].sort((a, b) => (a.title < b.title ? -1 : 1));

  res.status(StatusCodes.OK).json({ data: moviesSort });
};

const searchMovie = async (req, res) => {
  const { title, director, actor } = req.query;
  const objectQuery = {
    title: `title ILIKE '%%'`,
    director: `director ILIKE '%%'`,
    actor: `star1 ILIKE '%%' OR star2 ILIKE '%%' OR star3 ILIKE '%%' OR star4 ILIKE '%%'`,
  };

  if (title) {
    objectQuery.title = `title ILIKE '%${title}%'`;
  }
  if (director) {
    objectQuery.director = `director ILIKE '%${director}%'`;
  }
  if (actor) {
    objectQuery.actor = `star1 LIKE '%${actor}%' OR star2 ILIKE '%${actor}%' OR star3 ILIKE '%${actor}%' OR star4 ILIKE '%${actor}%'`;
  }

  const queryStr = `SELECT * FROM movie Where (${objectQuery.title}) AND (${objectQuery.director}) AND (${objectQuery.actor})`;

  const { rows } = await connectionPgDB.query(queryStr);
  connectionPgDB.end();

  res.status(StatusCodes.OK).json({ movies: rows, nbHits: rows.length });
};

module.exports = { getAllMovies, searchMovie };
