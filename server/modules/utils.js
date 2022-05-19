const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const JWT_SECRET = "my secret string";
/**
 * @summary this function will hash a string by algorithm md5
 * @param {String} str
 */

function hashMd5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}
function signToken(object) {
  return jwt.sign(object, JWT_SECRET, {
    expiresIn: "6h",
  });
}
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function validateString(str) {
  return typeof(str) == "string" && str.length > 0
}

module.exports = { hashMd5, signToken, verifyToken, validateString };
