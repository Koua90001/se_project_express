const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const app = express();


const { PORT = 3001 } = process.env;
mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log("Connected to DB");

})
.catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133"
  };
  next();
});

app.use("/", mainRouter);

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "An error has occurred on the server" : err.message;
  res.status(statusCode).send({ message });
  next();
};

app.use(errorHandler);

app.listen(PORT, () => {
console.log(`Listening on port ${PORT}`);
console.log("This is working")

});