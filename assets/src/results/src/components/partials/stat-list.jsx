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
      <li title={`${sortProp} - ${payload[sortProp]}`} className='raw'>{sortProp}: {formatNumber(payload[sort])}</li>
      <li title={`Rate ${sortProp} - ${payload[`rate_${sortProp}`]}`}>Rate: {formatNumber(payload[`rate_${sortProp}`])}</li>
      <li title={`MaxRate ${sortProp} - ${payload[`maxrate_${sortProp}`]}`}>MRate: {formatNumber(payload[`maxrate_${sortProp}`])}</li>
      <li title={`Hotness ${sortProp} - ${hotness}`} className='hotness'>
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
