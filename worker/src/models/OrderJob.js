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

    startedAt: Date,

    completedAt: Date,

    errorMessage: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("OrderJob", orderJobSchema);