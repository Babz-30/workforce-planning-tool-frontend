import "./search.css";

export default function Search({
  value,
  onChange,
  placeholder = "Search...",
  label = "Search",
  className = "",
}) {
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    onChange?.("");
  };

  return (
    <div className={`search ${className}`}>
      {label ? <label className="search-label">{label}</label> : null}

      <div className="search-input-wrap">
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />

        {value?.length > 0 && (
          <button
            type="button"
            className="search-clear"
            onClick={handleClear}
            aria-label="Clear search"
            title="Clear"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
