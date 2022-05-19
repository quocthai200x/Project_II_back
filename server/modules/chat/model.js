const mongooes = require("mongoose");
const userSchema = require("./schema");
const MODEL_NAME = "chat";
const COLLECTION_NAME = "chat";
const model = mongooes.model(MODEL_NAME, userSchema, COLLECTION_NAME);

module.exports = model;