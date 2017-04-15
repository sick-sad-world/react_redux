import React from 'react';
import PropTypes from 'prop-types';

// Global app progress tracker unit
// Works only on app initialization
// ===========================================================================
export default function ProgressTracker({ step, text }) {
  const width = (step) ? Math.round((100 / 6) * step) : 0;
  return <div className='loading-bar' data-text={`${text}...`}><span style={{ width: `${width}%` }}></span></div>;
}

// Default props
// ===========================================================================
ProgressTracker.defaultProps = {
  text: 'App initializing',
  step: 1
};

// Proptypes validation
// ===========================================================================
ProgressTracker.propTypes = {
  step: PropTypes.number.isRequired,
  text: PropTypes.string
};
