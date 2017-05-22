// Import helpers
// ===========================================================================
import { formatNumber, sortParamToShort } from '../helpers';

// Import react stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Result header
// ===========================================================================
export default function ResultHeader({ title, sort, value }) {
  return (
    <header>
      <span title={(sort !== 'found') ? `${sort} - ${value}` : null} className='comparator'>
        <b>{(sort === 'found') ? 'Found' : formatNumber(value)}</b>
        { (sort !== 'found') ? sortParamToShort(sort) : null }
      </span>
      <h1>{title}</h1>
    </header>
  );
}

ResultHeader.propTypes = {
  title: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};
