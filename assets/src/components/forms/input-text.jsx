// Import React related stuff
// ===========================================================================
import React from 'react';

// Text input Component
// ===========================================================================
export default function TextInput ({id, name, disabled, value, type, onChange, label, className, inputClassName}) {
  id = id || `fun-${type}-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id}>{label}:</label>
      <input 
        className={inputClassName || ''}
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