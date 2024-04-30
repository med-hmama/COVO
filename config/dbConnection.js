const mongoose = require("mongoose");

const DBconnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Successfully connected to Database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { DBconnection };
