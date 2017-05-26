import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber, sortParamToShort } from '../helpers';

// Result sorting badge
// ===========================================================================
export default function ResultSort({ sort, value }) {
  return (
    <span title={(sort !== 'found') ? `${sort} - ${value}` : null} className='badge comparator'>
      <b>{(sort === 'found') ? 'Found' : formatNumber(value)} </b>
      { (sort !== 'found') ? sortParamToShort(sort) : null }
    </span>
  );
}

ResultSort.propTypes = {
  sort: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};
