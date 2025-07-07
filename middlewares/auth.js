const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/errors/config");
const  UnauthorizedError  = require("../utils/errors/UnauthorizedError");

const authMiddleware = (req, res, next) => {
  if (
    req.method === "POST" &&
    (req.path === "/signin" || req.path === "/signup")
  ) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Authorization required"));
  }
};

module.exports = authMiddleware;