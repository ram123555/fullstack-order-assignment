function StatusBadge({ status }) {
  const config = {
    PENDING: {
      className: "status-badge status-pending",
      icon: "⏳",
      label: "Pending",
    },

    PROCESSING: {
      className: "status-badge status-processing",
      icon: "⚙️",
      label: "Processing",
    },

    COMPLETED: {
      className: "status-badge status-completed",
      icon: "✓",
      label: "Completed",
    },

    FAILED: {
      className: "status-badge status-failed",
      icon: "✕",
      label: "Failed",
    },
  };

  const current = config[status] || {
    className: "status-badge",
    icon: "?",
    label: status,
  };

  return (
    <span className={current.className}>
      <span className="status-icon">{current.icon}</span>
      {current.label}
    </span>
  );
}

export default StatusBadge;