require("dotenv").config();

const { Worker } = require("bullmq");

const connectDB = require("./config/db");
const redisConnection = require("./config/redis");

const processOrder = require("./services/processOrder");

const startWorker = async () => {

  await connectDB();

  const worker = new Worker(
    "order-processing",
    async (job) => {

      console.log(
        `Received job ${job.id}`
      );

      return await processOrder(job);
    },
    {
      connection: redisConnection,

      concurrency: 5
    }
  );

  worker.on("completed", (job) => {

    console.log(
      `Job ${job.id} completed successfully`
    );

  });

  worker.on("failed", async (job, error) => {

    console.error(
      `Job ${job?.id} failed`,
      error.message
    );

    // IMPORTANT:
    // After the final BullMQ attempt,
    // mark the order as FAILED.

    if (
      job &&
      job.attemptsMade >= 3
    ) {

      const Order = require("./models/Order");
      const OrderJob = require("./models/OrderJob");

      const { orderId } = job.data;

      await Order.findByIdAndUpdate(
        orderId,
        {
          status: "FAILED",
          errorMessage: error.message
        }
      );

      await OrderJob.findOneAndUpdate(
        {
          jobId: job.id.toString()
        },
        {
          status: "FAILED",
          errorMessage: error.message,
          attempts: job.attemptsMade
        }
      );

      console.log(
        `Order ${orderId} permanently FAILED`
      );
    }
  });

  worker.on("error", (error) => {

    console.error(
      "Worker error:",
      error.message
    );

  });

  console.log(
    "Order worker is running..."
  );
};

startWorker();