const mongoose = require("mongoose")
const USERNAME = process.env.USERNAME_MONGO
const PASSWORD = process.env.PASSWORD_MONGO

if (!USERNAME || !PASSWORD)
  throw new Error('Missing username/password for mongo')

const connectionString = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.091nb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect success to MongoDB")
  })
  .catch((err) => {
    console.error("Connect failed to MongoDB")
    console.error(err)
  });
