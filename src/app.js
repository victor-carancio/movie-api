require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

//db connection
const connectionDB = require("./database/connection.js");
const authenticateUser = require("./middlewares/authentication");

//middlewares
const errorHandlerMiddlerware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");

//routes
const authRoute = require("./routes/authRoute");
const moviesRoute = require("./routes/movieRoute");
const favoriteRoute = require("./routes/favoriteRoute");

//middleswares
app.set("trust proxy", 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  // res.send('<h1>Movies API</h1><a href="/api-docs">Documentation</a>');
  res.redirect("/api-docs");
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//routes
app.use("/api/v1/movie", moviesRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/favorites", authenticateUser, favoriteRoute);

//errors-handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddlerware);

/* app.get("/ping", async (req, res) => {
  const result = await connectionDB.query("SELECT 'pong' AS result");
  res.json(result);
}); */

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Listen on port ${port}`));
