import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'common/components/icon';

// Graph Error
// ===========================================================================
export default function GraphError({ children }) {
  return (
    <div className='state-error'>
      <Icon icon='error' />
      <p>{children}</p>
    </div>
  );
}

GraphError.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired
};
