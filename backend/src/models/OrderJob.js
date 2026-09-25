const mongoose = require("mongoose");

const orderJobSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    jobId: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "QUEUED",
        "PROCESSING",
        "COMPLETED",
        "FAILED"
      ],
      default: "QUEUED"
    },

    attempts: {
      type: Number,
      default: 0
    },

    startedAt: {
      type: Date,
      default: null
    },

    completedAt: {
      type: Date,
      default: null
    },

    errorMessage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("OrderJob", orderJobSchema);