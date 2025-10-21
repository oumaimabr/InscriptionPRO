import React, { useState } from 'react';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  success,
  name,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputClasses = `
    input 
    ${error ? 'input--error' : ''}
    ${success ? 'input--success' : ''}
    ${disabled ? 'input--disabled' : ''}
    ${isFocused ? 'input--focused' : ''}
    ${className}
  `;

  return (
    <div className="input-container d-flex flex-column">
      {label && (
        <label className="input-label mb-2" htmlFor={name}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <input
        type={type}
        name={name}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        {...props}
      />
      
      {error && <span className="input-error-message">{error}</span>}
      {success && <span className="input-success-message">{success}</span>}
    </div>
  );
};

export default Input;