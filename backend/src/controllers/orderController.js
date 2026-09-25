const Order = require("../models/Order");
const OrderJob = require("../models/OrderJob");
const orderQueue = require("../queues/orderQueue");
const orderSchema = require("../validators/orderValidator");

const generateOrderNumber = async () => {
  const count = await Order.countDocuments();

  return `ORD-${1001 + count}`;
};


// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const validatedData = orderSchema.parse(req.body);

    const {
      customerName,
      customerEmail,
      product,
      quantity,
      price
    } = validatedData;

    const totalAmount = quantity * price;

    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      product,
      quantity,
      price,
      totalAmount,
      status: "PENDING"
    });

    const job = await orderQueue.add(
      "process-order",
      {
        orderId: order._id.toString()
      }
    );

    await OrderJob.create({
      orderId: order._id,
      jobId: job.id,
      status: "QUEUED"
    });

    return res.status(201).json({
      success: true,
      orderId: order.orderNumber,
      status: order.status
    });

  } catch (error) {

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// GET ALL ORDERS
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};


// GET SINGLE ORDER
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const jobs = await OrderJob.find({
      orderId: order._id
    }).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      order,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order"
    });
  }
};


// RETRY ORDER
const retryOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.status !== "FAILED") {
      return res.status(400).json({
        success: false,
        message: "Only failed orders can be retried"
      });
    }

    order.status = "PENDING";
    order.errorMessage = null;

    await order.save();

    const job = await orderQueue.add(
      "process-order",
      {
        orderId: order._id.toString()
      }
    );

    await OrderJob.create({
      orderId: order._id,
      jobId: job.id,
      status: "QUEUED"
    });

    res.json({
      success: true,
      message: "Order retry queued",
      orderId: order.orderNumber,
      status: order.status
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retry order"
    });
  }
};


module.exports = {
  createOrder,
  getOrders,
  getOrder,
  retryOrder
};