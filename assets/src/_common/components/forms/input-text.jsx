// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { normalizeValue } from 'functions';

// Text input Component
// ===========================================================================
export default function TextInput({ id, name, disabled, value, type, onChange, label, desc, className, inputClassName }) {
  const domId = id || `fun-${type}-${name}`;
  return (
    <div className={className}>
      { (label) ? <label htmlFor={domId}>{label}:</label> : null }
      <input
        className={inputClassName}
        disabled={disabled}
        onChange={e => onChange(normalizeValue(e.target.value))}
        id={domId}
        type={type}
        name={name}
        {...(onChange) ? { value } : { defaultValue: value }}
      />
      {(desc) ? <small className='form-description'>{desc}</small> : null}
    </div>
  );
}

TextInput.defaultProps = {
  value: '',
  type: 'text',
  onChange: null
};

TextInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  type: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  desc: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string
};
