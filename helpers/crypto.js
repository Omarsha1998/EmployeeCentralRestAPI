const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createClient } = require("redis");

const hashPassword = async function (pw) {
  return await bcrypt.hash(pw, Number(process.env.BCRYPT_SALT_ROUNDS));
};

const passwordsMatched = async function (pw, hashedPw) {
  return await bcrypt.compare(pw, hashedPw);
};

const generateAccessToken = function (user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXP,
  });
};

// Middleware for Express.js
const validateAccessToken = async function (req, res, next) {
  let token =
    req.headers["authorization"]?.split(" ")?.[1] ?? req.query.accessToken;

  if (req.query.auth_token) {
    token = req.query.auth_token
  }

  if (!token) {
    return res
      .status(403)
      .json({ error: "Access token is required.", tokenError: true });
  }

  try {
    // VERIFY TOKEN
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true,
    });

    if (!user) {
      return res.status(403).json({
        error: "Access token is corrupted or malformed.",
        tokenError: true,
      });
    }

    // CHECK IF WHITELISTED
    try {
      const redisClient = createClient();
      await redisClient.connect();
      const userCode =
        user.code ??
        user.employeeId ??
        user.employee_id ??
        user.userData?.[0]?.code;
      const whiteListedToken = await redisClient.get(userCode);

      if (whiteListedToken !== token) {
        return res.status(403).json({
          error: "Access token is not whitelisted.",
          tokenError: true,
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: "Unable to connect to the Redis Server.",
        tokenError: true,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({
      error: "Access token is invalid or expired.",
      tokenError: true,
    });
  }
};

const validatePwResetToken = (req, res, next) => {
  if (!req.query.accessToken)
    return res.status(403).json({ error: "Access token is required." });

  jwt.verify(
    req.query.accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return res.status(403).json({
          error:
            "Password reset link has expired. Password reset links are only valid for 10 minutes.",
        });
      }

      req.user = user;
      next();
    },
  );
};

const generatePasswordResetToken = function (user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

module.exports = {
  hashPassword,
  passwordsMatched,
  hashMatched: passwordsMatched, // ALIAS
  generateAccessToken,
  validateAccessToken,
  generatePasswordResetToken,
  validatePwResetToken,
};
