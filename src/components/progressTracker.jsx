import React from 'react';

// Global app progress tracker unit
// Works only on app initialization
// ===========================================================================
export default function ProgressTracker (props) {
  // Calculate width of bar
  // ===========================================================================
  let width = (props.step) ? Math.round((100 / 6) * props.step) : 0;

  // Render bar with provided data
  // ===========================================================================
  return <div className='loading-bar' data-text={`${props.text || 'App initializing'}...`}><span style={{width: `${width}%`}}></span></div>;
}