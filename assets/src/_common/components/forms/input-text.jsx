// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Text input Component
// ===========================================================================
export default function TextInput({ id, name, disabled, value, type, onChange, label, desc, className, inputClassName }) {
  const domId = id || `fun-${type}-${name}`;
  return (
    <div className={className}>
      <label htmlFor={domId}>{label}:</label>
      <input
        className={inputClassName}
        disabled={disabled}
        value={value}
        onChange={onChange}
        id={domId}
        type={type || 'text'}
        name={name}
      />
      {(desc) ? <small className='form-description'>{desc}</small> : null}
    </div>
  );
}

TextInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.any.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  desc: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string
};
