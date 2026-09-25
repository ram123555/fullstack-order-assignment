const IORedis = require("ioredis");

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,

  maxRetriesPerRequest: null
});

redisConnection.on("connect", () => {
  console.log("Redis connected successfully");
});

redisConnection.on("error", (error) => {
  console.error("Redis error:", error.message);
});

module.exports = redisConnection;