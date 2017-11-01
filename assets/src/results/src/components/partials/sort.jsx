import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber, sortParamToShort } from '../../helpers';

// Result sorting badge
// ===========================================================================
export default function ResultSort({ sort, value, className }) {
  return (
    <span title={(sort !== 'found') ? `${sort} - ${value}` : null} className={className}>
      <b>{(sort === 'found') ? 'Found' : formatNumber(value)} </b>
      { (sort !== 'found') ? sortParamToShort(sort) : null }
    </span>
  );
}

ResultSort.defaultProps = {
  className: 'badge comparator'
};

ResultSort.propTypes = {
  className: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};
