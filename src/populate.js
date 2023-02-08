require("dotenv").config();
const connectionDB = require("./database/connection.js");

const moviesCsv = require("../movieDataSet");

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

    const insertStatement = `INSERT INTO movie ( posterLink ,title, releasedYear, certificate, runTime, genre, imdbRating, overview, director, star1, star2, star3, star4, votes, gross) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
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
  await connectionDB.query(statement, data, true, (err, results, fields) => {
    if (err) {
      console.log("Unable to insert item at row ", i + 1);
      return console.log(err);
    }
  });
};

start();
