import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'common/components/icon';

// Error component -> Display criticat JS erros on client
// ===========================================================================
export default function ClientError({ error }) {
  return (
    <div className='global-error'>
      <div>
        <h3>Oops! Error encountered</h3>
        <p>{error}</p>
        <small>Please contact us and provide details. So we able to fix it.</small>
      </div>
      <Icon icon='error' className='bg' viewBox='0 0 24 24' />
    </div>
  );
}

// Proptypes validation
// ===========================================================================
ClientError.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Error)
  ]).isRequired
};
