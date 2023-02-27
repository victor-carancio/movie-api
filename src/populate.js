require("dotenv").config();
const { connectionPgDB } = require("./database/connection");
// const connectionDB = require("./database/connection.js");

const moviesCsv = require("../movieDataSet");

const testConnection = async () => {
  try {
    const res = await connectionPgDB.query("Select * from movie");
    console.log(res.rows.length);

    await connectionPgDB.end();
  } catch (error) {
    console.log(error);
  }
};
testConnection();

const start = async () => {
  moviesCsv.forEach((element) => {
    const {
      Poster_Link,
      Series_Title,
      Released_Year,
      Certificate,
      Runtime,
      Genre,
      IMDB_Rating,
      Overview,
      Director,
      Star1,
      Star2,
      Star3,
      Star4,
      No_of_Votes,
      Gross,
    } = element;

    const insertStatement =
      "INSERT INTO movie ( posterLink ,title, releasedYear, certificate, runTime, genre, imdbRating, overview, director, star1, star2, star3, star4, votes, gross) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)";
    const insertData = [
      Poster_Link,
      Series_Title,
      Released_Year,
      Certificate,
      Runtime,
      Genre,
      IMDB_Rating,
      Overview,
      Director,
      Star1,
      Star2,
      Star3,
      Star4,
      No_of_Votes,
      Gross,
    ];

    asyncInsertDB(insertStatement, insertData);
    console.log("complete");
  });
};

const asyncInsertDB = async (statement, data) => {
  try {
    await pool.query(statement, data);
  } catch (error) {
    console.log(error);
  }
};

// start();
