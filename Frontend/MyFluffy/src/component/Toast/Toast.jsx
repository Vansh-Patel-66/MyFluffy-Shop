import React from "react";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const Toast = () => {
  const { toast } = useAuth();

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle size={20} color="var(--success)" />,
    error: <AlertCircle size={20} color="var(--danger)" />,
    warning: <AlertTriangle size={20} color="var(--warning)" />,
    info: <Info size={20} color="var(--info)" />,
  };

  const getStyle = () => {
    switch (toast.type) {
      case "success":
        return { borderLeft: "4px solid var(--success)", background: "rgba(255, 255, 255, 0.95)" };
      case "error":
        return { borderLeft: "4px solid var(--danger)", background: "rgba(255, 255, 255, 0.95)" };
      case "warning":
        return { borderLeft: "4px solid var(--warning)", background: "rgba(255, 255, 255, 0.95)" };
      default:
        return { borderLeft: "4px solid var(--info)", background: "rgba(255, 255, 255, 0.95)" };
    }
  };

  return (
    <div className="toast-container" style={toastStyles.container}>
      <div className="toast-card glass-panel" style={{ ...toastStyles.card, ...getStyle() }}>
        {icons[toast.type] || <Info size={20} />}
        <span style={toastStyles.message}>{toast.message}</span>
      </div>
    </div>
  );
};

const toastStyles = {
  container: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    animation: "slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    maxWidth: "350px",
  },
  message: {
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "var(--text-main)",
  },
};

export default Toast;
