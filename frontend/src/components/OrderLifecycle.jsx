function OrderLifecycle({ status }) {
  const steps = [
    {
      key: "PENDING",
      title: "Order Created",
      description: "Order saved and job queued",
    },
    {
      key: "PROCESSING",
      title: "Processing",
      description: "Worker is processing the order",
    },
    {
      key: "COMPLETED",
      title: "Completed",
      description: "External API processed successfully",
    },
  ];

  const getStepState = (stepKey) => {
    if (status === "FAILED") {
      if (stepKey === "PENDING") return "completed";
      if (stepKey === "PROCESSING") return "failed";
      return "waiting";
    }

    const order = {
      PENDING: 1,
      PROCESSING: 2,
      COMPLETED: 3,
    };

    const current = order[status] || 1;
    const step = order[stepKey];

    if (step < current) return "completed";
    if (step === current) return "active";

    return "waiting";
  };

  return (
    <div className="lifecycle">
      {steps.map((step, index) => {
        const state = getStepState(step.key);

        return (
          <div
            className={`lifecycle-step ${state}`}
            key={step.key}
          >
            <div className="lifecycle-icon">
              {state === "completed" && "✓"}

              {state === "active" && (
                <span className="pulse-dot"></span>
              )}

              {state === "failed" && "✕"}

              {state === "waiting" && index + 1}
            </div>

            <div className="lifecycle-content">
              <h6>{step.title}</h6>

              <p>{step.description}</p>
            </div>

            {index < steps.length - 1 && (
              <div className={`lifecycle-line ${state}`} />
            )}
          </div>
        );
      })}

      {status === "FAILED" && (
        <div className="failed-lifecycle">
          <div className="lifecycle-icon failed">
            ✕
          </div>

          <div>
            <h6>Processing Failed</h6>

            <p>
              The maximum number of processing attempts
              was reached.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderLifecycle;