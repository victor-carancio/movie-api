const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };
  if (err.code === "ER_DUP_ENTRY") {
    customError.msg = "Email provide already exists, please try another one";
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }
  console.log(err);
  return res.status(customError.statusCode).json({ msg: customError.msg });

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Something went wrong try again later", err });
};

module.exports = errorHandlerMiddleware;
