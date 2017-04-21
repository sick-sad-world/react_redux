import React from 'react';
import PropTypes from 'prop-types';
import { imageStr } from 'common/typecheck';

// Small block used to represent current user brief data
// ===========================================================================
export default function UserBlock({ image, fullname, position }) {
  return (
      <div className='mod-user-block'>
        <img src={ image } alt={ fullname } />
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
  image: imageStr.isRequired,
  fullname: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired
};
