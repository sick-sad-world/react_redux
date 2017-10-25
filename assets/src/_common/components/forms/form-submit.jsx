// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function FormSubmit({ text, type, loading, className, ...props }) {
  return (
    <button type={type} disabled={loading} className={classNames('statefull', className)} {...props}>{(loading) ? (
      <svg className='spinner' width='65px' height='65px' viewBox='0 0 66 66'>
        <circle className='path' fill='none' strokeWidth='6' strokeLinecap='round' cx='33' cy='33' r='30'></circle>
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
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
};
