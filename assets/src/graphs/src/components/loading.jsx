import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'common/components/icon';

// Graph Loading
// ===========================================================================
export default function GraphLoading({ children }) {
  return (
    <div className='state-loading'>
      <Icon icon='loading' />
      <p>{children}</p>
    </div>
  );
}

GraphLoading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired
};
