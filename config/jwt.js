const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No Token Provided" });
  }

  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET || "123456",
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Failed To Authenticate Token",
          error: err,
        });
      }

      req.user = decoded;
      next();
    }
  );
}

module.exports = verifyToken;
