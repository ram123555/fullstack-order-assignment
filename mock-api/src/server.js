require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());


// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Mock external API is running",
    failMode: process.env.FAIL_MODE === "true"
  });
});


// Process order
app.post("/api/process", async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    console.log("External API received:", {
      orderId,
      amount
    });

    // Validation
    if (!orderId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "orderId and amount are required"
      });
    }

    // Simulate processing delay
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });


    // ==============================
    // FAILURE MODE
    // ==============================

    if (process.env.FAIL_MODE === "true") {

      console.log(
        `External API intentionally failing for ${orderId}`
      );

      return res.status(500).json({
        success: false,
        message: "External payment service failed"
      });
    }


    // ==============================
    // SUCCESS MODE
    // ==============================

    const transactionId = `TXN-${Date.now()}`;

    console.log(
      `Transaction successful: ${transactionId}`
    );

    return res.status(200).json({
      success: true,
      transactionId
    });

  } catch (error) {

    console.error(
      "External API error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "External API error"
    });
  }
});


const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(
    `Mock API running on port ${PORT}`
  );

  console.log(
    `Failure mode: ${process.env.FAIL_MODE === "true" ? "ON" : "OFF"}`
  );
});