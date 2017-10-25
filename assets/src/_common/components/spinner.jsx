import React from 'react';
import PropTypes from 'prop-types';

export default function Spinner({ size, viewBox }) {
  return (
    <svg className='spinner' width={`${size}px`} height={`${size}px`} viewBox={viewBox}>
      <circle className='path' fill='none' strokeWidth='6' strokeLinecap='round' cx='33' cy='33' r='30'></circle>
    </svg>
  );
}

Spinner.defaultProps = {
  size: 65,
  viewBox: '0 0 66 66'
};

Spinner.propTypes = {
  viewBox: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
};
