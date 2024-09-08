const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "A token is required" });
  }

  jwt.verify(token, "secret", (error, decoded) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Token expired" });
      }
      return res.status(400).json({ message: "Token is invalid" });
    }
    req.user = decoded;
    next;
  });
}

module.exports = {
  verifyToken,
};
