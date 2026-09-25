import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function CreateOrder() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    product: "",
    quantity: 1,
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const response = await api.post(
        "/orders",
        {
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          product: form.product,
          quantity: Number(form.quantity),
          price: Number(form.price),
        }
      );

      setSuccess(
        `Order ${response.data.orderId} created successfully`
      );

      setForm({
        customerName: "",
        customerEmail: "",
        product: "",
        quantity: 1,
        price: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (error) {

      console.error(error);

      const message =
        error.response?.data?.message ||
        "Failed to create order";

      setError(message);

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-lg-7">

          <div className="card shadow-sm">

            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">
                Create New Order
              </h4>
            </div>

            <div className="card-body">

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}


              <form onSubmit={handleSubmit}>

                {/* Customer Name */}

                <div className="mb-3">

                  <label className="form-label">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    className="form-control"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Rahul Das"
                    required
                  />

                </div>


                {/* Email */}

                <div className="mb-3">

                  <label className="form-label">
                    Customer Email
                  </label>

                  <input
                    type="email"
                    name="customerEmail"
                    className="form-control"
                    value={form.customerEmail}
                    onChange={handleChange}
                    placeholder="rahul@example.com"
                    required
                  />

                </div>


                {/* Product */}

                <div className="mb-3">

                  <label className="form-label">
                    Product
                  </label>

                  <input
                    type="text"
                    name="product"
                    className="form-control"
                    value={form.product}
                    onChange={handleChange}
                    placeholder="Laptop"
                    required
                  />

                </div>


                <div className="row">

                  {/* Quantity */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Quantity
                    </label>

                    <input
                      type="number"
                      name="quantity"
                      className="form-control"
                      min="1"
                      value={form.quantity}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* Price */}

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Unit Price
                    </label>

                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="65000"
                      required
                    />

                  </div>

                </div>


                {/* Total */}

                {form.price && (

                  <div className="alert alert-light border">

                    <strong>
                      Total Amount:
                    </strong>{" "}

                    ₹
                    {(
                      Number(form.quantity || 0) *
                      Number(form.price || 0)
                    ).toLocaleString()}

                  </div>

                )}


                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Creating Order..."
                    : "Create Order"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateOrder;