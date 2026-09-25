import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../services/api";

import StatusBadge from "../components/StatusBadge";

import OrderLifecycle from "../components/OrderLifecycle";

function OrderDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [retrying, setRetrying] = useState(false);

  const [retryMessage, setRetryMessage] =
    useState("");

  const fetchOrder = useCallback(async () => {
    try {
      const response = await api.get(
        `/orders/${id}`
      );

      setData(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch order:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();

    const interval = setInterval(
      fetchOrder,
      2000
    );

    return () => clearInterval(interval);
  }, [fetchOrder]);

  const handleRetry = async () => {
    setRetrying(true);
    setRetryMessage("");

    try {
      const response = await api.post(
        `/orders/${id}/retry`
      );

      setRetryMessage(
        response.data.message ||
          "Order queued for retry."
      );

      await fetchOrder();
    } catch (error) {
      setRetryMessage(
        error.response?.data?.message ||
          "Retry failed."
      );
    } finally {
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" />

        <p className="mt-3">
          Loading order...
        </p>
      </div>
    );
  }

  if (!data || !data.order) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Order not found.
        </div>
      </div>
    );
  }

  const {
    order,
    jobs = [],
  } = data;

  const latestJob = jobs[0];

  return (
    <div className="dashboard-page">

      <div className="container py-4">

        {/* Header */}

        <div className="details-header">

          <div>

            <Link
              to="/"
              className="back-link"
            >
              ← Back to Orders
            </Link>

            <div className="details-title">

              <h1>
                {order.orderNumber}
              </h1>

              <StatusBadge
                status={order.status}
              />

            </div>

            <p>
              Created{" "}
              {new Date(
                order.createdAt
              ).toLocaleString("en-IN")}
            </p>

          </div>

          {order.status === "FAILED" && (

            <button
              className="retry-btn"
              onClick={handleRetry}
              disabled={retrying}
            >
              {retrying ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Queuing...
                </>
              ) : (
                <>
                  ↻ Retry Order
                </>
              )}
            </button>

          )}

        </div>


        {retryMessage && (
          <div className="alert alert-info">
            {retryMessage}
          </div>
        )}


        {/* Lifecycle */}

        <div className="detail-card mb-4">

          <div className="detail-card-header">
            <div>
              <h3>Processing Lifecycle</h3>

              <p>
                Track the asynchronous order
                workflow.
              </p>
            </div>

            <div className="auto-refresh">
              <span className="live-dot"></span>
              Auto-updating
            </div>
          </div>

          <div className="lifecycle-wrapper">
            <OrderLifecycle
              status={order.status}
            />
          </div>

        </div>


        <div className="row g-4">

          {/* Order Information */}

          <div className="col-lg-7">

            <div className="detail-card h-100">

              <div className="detail-card-header">
                <div>
                  <h3>Order Information</h3>
                  <p>
                    Customer and payment details
                  </p>
                </div>
              </div>

              <div className="order-info-grid">

                <div className="info-item">
                  <span>Customer</span>
                  <strong>
                    {order.customerName}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Email</span>
                  <strong>
                    {order.customerEmail}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Product</span>
                  <strong>
                    {order.product}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Quantity</span>
                  <strong>
                    {order.quantity}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Unit Price</span>
                  <strong>
                    ₹
                    {Number(
                      order.price
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="info-item total-info">
                  <span>Total Amount</span>
                  <strong>
                    ₹
                    {Number(
                      order.totalAmount
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                {order.externalReference && (
                  <div className="info-item full">
                    <span>
                      External Transaction
                    </span>

                    <strong className="transaction-id">
                      {order.externalReference}
                    </strong>
                  </div>
                )}

              </div>

            </div>

          </div>


          {/* Job Information */}

          <div className="col-lg-5">

            <div className="detail-card h-100">

              <div className="detail-card-header">
                <div>
                  <h3>Background Job</h3>

                  <p>
                    BullMQ processing information
                  </p>
                </div>
              </div>


              {latestJob ? (

                <div className="job-details">

                  <div className="job-row">
                    <span>Job ID</span>
                    <strong>
                      #{latestJob.jobId}
                    </strong>
                  </div>

                  <div className="job-row">
                    <span>Status</span>
                    <StatusBadge
                      status={
                        latestJob.status ===
                        "QUEUED"
                          ? "PENDING"
                          : latestJob.status
                      }
                    />
                  </div>

                  <div className="job-row">
                    <span>Attempts</span>
                    <strong>
                      {latestJob.attempts} / 3
                    </strong>
                  </div>

                  <div className="attempt-progress">

                    <div
                      className="attempt-progress-bar"
                      style={{
                        width: `${Math.min(
                          (latestJob.attempts /
                            3) *
                            100,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  {latestJob.startedAt && (
                    <div className="job-row">
                      <span>Started</span>
                      <strong>
                        {new Date(
                          latestJob.startedAt
                        ).toLocaleTimeString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  )}

                  {latestJob.completedAt && (
                    <div className="job-row">
                      <span>Completed</span>
                      <strong>
                        {new Date(
                          latestJob.completedAt
                        ).toLocaleTimeString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  )}

                  {latestJob.errorMessage && (
                    <div className="job-error">
                      <strong>
                        Processing Error
                      </strong>

                      <p>
                        {latestJob.errorMessage}
                      </p>
                    </div>
                  )}

                </div>

              ) : (

                <div className="empty-state small">
                  No job information available.
                </div>

              )}

            </div>

          </div>

        </div>


        {/* Job History */}

        {jobs.length > 1 && (

          <div className="detail-card mt-4">

            <div className="detail-card-header">

              <div>
                <h3>
                  Processing History
                </h3>

                <p>
                  Previous background job attempts
                </p>
              </div>

            </div>

            <div className="job-history">

              {jobs.map((job, index) => (

                <div
                  className="history-item"
                  key={job._id}
                >

                  <div className="history-number">
                    {jobs.length - index}
                  </div>

                  <div className="history-content">

                    <div className="history-top">

                      <strong>
                        Job #{job.jobId}
                      </strong>

                      <StatusBadge
                        status={
                          job.status ===
                          "QUEUED"
                            ? "PENDING"
                            : job.status
                        }
                      />

                    </div>

                    <span>
                      {job.attempts} attempt
                      {job.attempts !== 1
                        ? "s"
                        : ""}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>
    </div>
  );
}

export default OrderDetails;