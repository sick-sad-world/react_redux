// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Spinner from '../spinner';

export default function FormSubmit({ text, type, loading, className, ...props }) {
  return (
    <button type={type} disabled={loading} className={classNames('statefull', className)} {...props}>
      {(loading) ? (<Spinner/>) : text}
    </button>
  );
}

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
