const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const AuthToken = req.header("Authorization");
  const Token = AuthToken && AuthToken.split(" ")[1];
  if (Token) {
    try {
      const decode = jwt.verify(Token, process.env.secret_token);
      req.userId = decode.userId;
      req.cardId = decode.idCard;
      req.role = decode.role;
      req.roleAd = decode.role[0];
      next();
    } catch (error) {
      res.status(403).json({ success: false, message: "Token Invalid" });
    }
  } else {
    res.status(401).json({ success: false, message: "Token not found" });
  }
};

module.exports = verifyToken;
