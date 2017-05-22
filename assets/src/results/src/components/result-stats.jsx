import React from 'react';
import PropTypes from 'prop-types';
import { proptocolRegExp } from '../defaults';

// Brief Stats in Result
// ===========================================================================
export default function ResultStats({ domain, found, proptocolRegExp }) {
  return (
    <small className='stats'>
      <span className='domain'>{domain.replace(proptocolRegExp, '')}</span>
      <time dateTime={found}>{found}</time>
    </small>
  );
}

ResultStats.defaultProps = {
  proptocolRegExp
};

ResultStats.propTypes = {
  domain: PropTypes.string.isRequired,
  found: PropTypes.string.isRequired,
  proptocolRegExp: PropTypes.instanceOf(RegExp).isRequired
};
