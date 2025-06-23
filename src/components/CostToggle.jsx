const CostToggle = ({ id, label, description, isChecked, onChange, price }) => {
  const handleChange = (e) => {
    onChange(e.target.checked);
  };

  return (
    <div
      className={`mb-4 cursor-pointer rounded-lg border p-4 transition-all ${
        isChecked
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
      }`}
      onClick={() => onChange(!isChecked)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={id}
              checked={isChecked}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
            <label
              htmlFor={id}
              className="ml-2 text-sm font-medium text-gray-700"
            >
              {label}
            </label>
          </div>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className="ml-4 text-right">
          <span className="text-sm font-medium text-gray-900">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CostToggle;
