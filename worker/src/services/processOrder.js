const axios = require("axios");

const Order = require("../models/Order");
const OrderJob = require("../models/OrderJob");

const processOrder = async (job) => {

  const { orderId } = job.data;

  console.log(
    `Processing order: ${orderId}`
  );

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const orderJob = await OrderJob.findOne({
    jobId: job.id.toString()
  });

  // Update order
  order.status = "PROCESSING";
  order.errorMessage = null;

  await order.save();

  // Update job
  if (orderJob) {
    orderJob.status = "PROCESSING";
    orderJob.attempts = job.attemptsMade + 1;
    orderJob.startedAt = new Date();

    await orderJob.save();
  }

  try {

    console.log(
      `Calling external API for ${order.orderNumber}`
    );

    const response = await axios.post(
      process.env.EXTERNAL_API_URL,
      {
        orderId: order.orderNumber,
        amount: order.totalAmount
      },
      {
        timeout: 10000
      }
    );

    const data = response.data;

    if (!data.success) {
      throw new Error(
        data.message || "External API failed"
      );
    }

    // Successful processing
    order.status = "COMPLETED";

    order.externalReference =
      data.transactionId;

    order.errorMessage = null;

    await order.save();

    if (orderJob) {
      orderJob.status = "COMPLETED";
      orderJob.completedAt = new Date();
      orderJob.errorMessage = null;

      await orderJob.save();
    }

    console.log(
      `Order ${order.orderNumber} completed`
    );

    return data;

  } catch (error) {

    console.error(
      `Order ${order.orderNumber} processing failed:`,
      error.message
    );

    // Don't mark FAILED here permanently.
    // BullMQ will retry the job.
    throw error;
  }
};

module.exports = processOrder;