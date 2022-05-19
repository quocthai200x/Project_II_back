const mongooes = require("mongoose");
const userSchema = require("./schema");
const MODEL_NAME = "users";
const COLLECTION_NAME = "users";
const model = mongooes.model(MODEL_NAME, userSchema, COLLECTION_NAME);

module.exports = model;
