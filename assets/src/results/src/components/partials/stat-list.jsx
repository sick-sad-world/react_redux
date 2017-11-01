import React from 'react';
import PropTypes from 'prop-types';
import { decomposeColumnSort } from 'src/columns';
import { formatNumber, sortParamToShort } from '../../helpers';
import HotnessBar from './hotness';

// Brief Stats in Result
// ===========================================================================
export default function ResultStats({ payload, sort, className }) {
  const sortProp = decomposeColumnSort(sort).sort_prop;
  const hotness = payload[`hotness_${sortProp}`];
  return (
    <ul className={className}>
      <li className='raw'>{sortProp}: {formatNumber(payload[sort])}</li>
      <li>Rate: {formatNumber(payload[`rate_${sortProp}`])}</li>
      <li>MRate: {formatNumber(payload[`maxrate_${sortProp}`])}</li>
      <li className='hotness'>
        Hot:{ (hotness * 100).toFixed(2) }%
        <HotnessBar value={hotness} />
      </li>
    </ul>
  );
}

ResultStats.defaultProps = {
  className: 'stats',
  payload: {}
};

ResultStats.propTypes = {
  className: PropTypes.string.isRequired,
  payload: PropTypes.object.isRequired,
  sort: PropTypes.string.isRequired
};
