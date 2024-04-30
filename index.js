const express = require("express");
const dbConnection = require("./config/dbConnection");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;

const { authenticate } = require("./middlewares/authMiddleware");

app.use(express.json());
dotenv.config();
dbConnection();

const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");

app.use("/user", userRoute);
app.use("/post", authenticate, postRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
