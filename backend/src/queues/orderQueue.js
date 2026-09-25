const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const orderQueue = new Queue("order-processing", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 2000
    },

    removeOnComplete: false,
    removeOnFail: false
  }
});

module.exports = orderQueue;