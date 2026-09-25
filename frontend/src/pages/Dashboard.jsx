import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get("/orders");

      setOrders(response.data.orders);

      setLastUpdated(new Date());
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const stats = {
    total: orders.length,

    pending: orders.filter(
      (order) => order.status === "PENDING"
    ).length,

    processing: orders.filter(
      (order) => order.status === "PROCESSING"
    ).length,

    completed: orders.filter(
      (order) => order.status === "COMPLETED"
    ).length,

    failed: orders.filter(
      (order) => order.status === "FAILED"
    ).length,
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" />

        <p className="mt-3">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container py-4">

        {/* Header */}

        <div className="dashboard-header">

          <div>
            <div className="eyebrow">
              ADMIN CONSOLE
            </div>

            <h1>
              Order Processing
            </h1>

            <p>
              Monitor orders and background processing
              in real time.
            </p>
          </div>

          <Link
            to="/create-order"
            className="create-order-btn"
          >
            <span>＋</span>
            Create Order
          </Link>

        </div>


        {/* Live indicator */}

        <div className="live-bar">

          <div className="live-indicator">
            <span className="live-dot"></span>
            Live monitoring
          </div>

          {lastUpdated && (
            <span>
              Last updated{" "}
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}

        </div>


        {/* Statistics */}

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon total">
              ◎
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{stats.total}</strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon pending">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon processing">
              ⚙
            </div>

            <div>
              <span>Processing</span>
              <strong>{stats.processing}</strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon completed">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>{stats.completed}</strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon failed">
              !
            </div>

            <div>
              <span>Failed</span>
              <strong>{stats.failed}</strong>
            </div>
          </div>

        </div>


        {/* Failed alert */}

        {stats.failed > 0 && (
          <div className="failure-alert">

            <div className="failure-alert-icon">
              !
            </div>

            <div>
              <strong>
                {stats.failed} order
                {stats.failed > 1 ? "s" : ""} require
                attention
              </strong>

              <p>
                Open a failed order to review the
                error and retry processing.
              </p>
            </div>

          </div>
        )}


        {/* Orders */}

        <div className="orders-card">

          <div className="orders-header">

            <div>
              <h3>Recent Orders</h3>

              <span>
                {orders.length} total orders
              </span>
            </div>

            <button
              className="refresh-btn"
              onClick={fetchOrders}
            >
              ↻ Refresh
            </button>

          </div>


          {orders.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📦
              </div>

              <h4>No orders yet</h4>

              <p>
                Create your first order to start
                processing.
              </p>

              <Link
                to="/create-order"
                className="btn btn-primary"
              >
                Create Order
              </Link>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="orders-table">

                <thead>
                  <tr>
                    <th>ORDER</th>
                    <th>CUSTOMER</th>
                    <th>PRODUCT</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>CREATED</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (

                    <tr key={order._id}>

                      <td>
                        <Link
                          className="order-number"
                          to={`/orders/${order._id}`}
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      <td>
                        <div className="customer-cell">

                          <div className="avatar">
                            {order.customerName
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {order.customerName}
                            </strong>

                            <small>
                              {order.customerEmail}
                            </small>
                          </div>

                        </div>
                      </td>

                      <td>
                        <strong>
                          {order.product}
                        </strong>

                        <small className="quantity">
                          Qty: {order.quantity}
                        </small>
                      </td>

                      <td>
                        <strong>
                          ₹
                          {Number(
                            order.totalAmount
                          ).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        <StatusBadge
                          status={order.status}
                        />
                      </td>

                      <td>
                        <span className="date">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString("en-IN")}
                        </span>

                        <small>
                          {new Date(
                            order.createdAt
                          ).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </small>
                      </td>

                      <td>
                        <Link
                          to={`/orders/${order._id}`}
                          className="view-btn"
                        >
                          View →
                        </Link>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;