import "./Button.css";

const Button = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  variant = "primary",
}) => {
  return (
    <button
      type={type}
      className={`app-button ${variant}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Please wait..." : label}
    </button>
  );
};

export default Button;