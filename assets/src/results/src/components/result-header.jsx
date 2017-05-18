import React from 'react';
import PropTypes from 'prop-types';

// Result header
// ===========================================================================
export default function ResultHeader({ title, url, domain, found }) {
  return (
    <header>
      <h1>{title}</h1>
      <small className='stats'>
        <span className='domain'>{domain}</span>
        <time dateTime={found}>{found}</time>
      </small>
    </header>
  );
}

ResultHeader.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  found: PropTypes.string.isRequired
};
