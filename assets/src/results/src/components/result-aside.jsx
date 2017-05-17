import React from 'react';
import PropTypes from 'prop-types';
import { childrenShape } from 'common/typecheck';

import { formatNumber, sortParamToShort } from '../helpers';

// Result aside actions
// ===========================================================================
export default function ResultAside({ sortParam, sort, children }) {
  return (
    <aside>
      <span className='badge comparator'>
        <b>{(sortParam === 'found') ? 'Found' : formatNumber(sort)}</b>
        { (sortParam !== 'found') ? sortParamToShort(sortParam) : null }
      </span>
      { children }
    </aside>
  );
}

ResultAside.defaultProps = {
  favorite: false,
  ignore: false,
  children: null
};

ResultAside.propTypes = {
  sortParam: PropTypes.string.isRequired,
  sort: PropTypes.number.isRequired,
  children: childrenShape
};
