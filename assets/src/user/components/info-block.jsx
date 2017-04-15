import React from 'react';
import PropTypes from 'prop-types';

export default function UserBlock({ image, fullname, position }) {
  return (
      <div className='mod-user-block'>
        <img src={ `/${image}` } alt={ fullname } />
        <div className='t-ellipsis'>
          <h2>{ fullname }</h2>
          <small>{ position }</small>
        </div>
      </div>
  );
}

// Proptypes validation
// ===========================================================================
UserBlock.propTypes = {
  image: PropTypes.string.isRequired,
  fullname: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired
};
