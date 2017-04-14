import React from 'react';
import PropTypes from 'prop-types';

// Error component -> Display criticat JS erros on client
// ===========================================================================
export default function ClientError({ error }) {
  return (
    <div className='global-error'>
      <h3>Oops! Error encountered</h3>
      <p>{error}</p>
      <small>Please contact us and provide details. So we able to fix it.</small>
    </div>
  );
}

ClientError.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Error)
  ]).isRequired
};
