// Import React related stuff
// ===========================================================================
import React from 'react';

// Text input Component
// ===========================================================================
export default function TextInput ({id, name, disabled, value, type, onChange, label, desc, className, inputClassName}) {
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
      {(desc) ? <small className='form-description'>{desc}</small> : null}
    </div>
  );
}