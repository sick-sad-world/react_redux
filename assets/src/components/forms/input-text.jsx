// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Text input Component
// ===========================================================================
export default function TextInput ({id, name, disabled, value, type, onChange, label, className}) {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}:</label>
      <input 
        disabled={disabled}
        value={value}
        onChange={onChange}
        id={id}
        type={type || 'text'}
        name={name}
      />
    </div>
  );
}