import React from 'react';
import PropTypes from 'prop-types';

// Graph Loading
// ===========================================================================
export default function GraphLoading({ children }) {
  return (
    <div className='state-loading'>
      <img src='/img/loading2.svg' />
      <p>{children}</p>
    </div>
  );
}

GraphLoading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired
};
