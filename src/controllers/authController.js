const { CustomAPIError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { connectionPgDB } = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRound = 10;

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const passwordHashed = await bcrypt.hash(password, saltRound);

  const response = await connectionPgDB.query(
    "INSERT INTO users (userName, userEmail, password) VALUES ($1,$2,$3)",
    [name, email, passwordHashed]
  );

  const userCreated = await connectionPgDB.query(
    `SELECT userid from users where userEmail = '${email}'`
  );

  const token = jwt.sign(
    { userId: userCreated.rows[0].userid, name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(StatusCodes.CREATED).json({
    user: { userId: userCreated.rows[0].userid, userName: name },
    token,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomAPIError("Please provide credentials");
  }

  const currUser = await connectionPgDB.query(
    `SELECT * from users where userEmail = '${email}'`
  );

  if (currUser.rows.length <= 0) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    currUser.rows[0].password
  );

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = jwt.sign(
    { userId: currUser.rows[0].userid, name: currUser.rows[0].username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(StatusCodes.OK).json({
    user: {
      userId: currUser.rows[0].userid,
      userName: currUser.rows[0].username,
    },
    token,
  });
};

module.exports = { createUser, loginUser };
