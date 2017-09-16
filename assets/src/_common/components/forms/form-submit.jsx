// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

export default function FormSubmit({ text, type, loading, ...props }) {
  return (
    <button type={type} {...props}>{(loading) ? (
      <svg className='spinner' width='65px' height='65px' viewBox='0 0 66 66'>
        <circle className='path' disabled={loading} fill='none' strokeWidth='6' strokeLinecap='round' cx='33' cy='33' r='30'></circle>
      </svg>
    ) : text}</button>
  );
} //

FormSubmit.defaultProps = {
  text: 'Submit',
  type: 'submit',
  loading: false
};

FormSubmit.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
};
