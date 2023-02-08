const { CustomAPIError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const connectionDB = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRound = 10;

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const passwordHashed = await bcrypt.hash(password, saltRound);

  const [user] = await connectionDB.query(
    "INSERT INTO user (userName, userEmail, password) VALUES (?,?,?)",
    [name, email, passwordHashed]
  );

  const token = jwt.sign(
    { userId: user.insertId, name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res
    .status(StatusCodes.CREATED)
    .json({ user: { userId: user.insertId, userName: name }, token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomAPIError("Please provide credentials");
  }

  const [user] = await connectionDB.query(
    "SELECT * from user where userEmail = ?",
    [email]
  );
  if (user.length <= 0) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = jwt.sign(
    { userId: user[0].userId, name: user[0].userName },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(StatusCodes.OK).json({
    user: { userId: user[0].userId, userName: user[0].userName },
    token,
  });
};

module.exports = { createUser, loginUser };
