const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("Worker MongoDB connected");
  } catch (error) {
    console.error(
      "Worker MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;