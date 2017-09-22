// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import child components
// ===========================================================================
import { Link } from 'react-router';
import Icon from '../components/icon';

// Edit form generic header component
// ===========================================================================
export default function SectionHeader({ title, description, url }) {
  return (
    <header className='subsection-header'>
      {(url) ? (
        <Link to={url}>
          <Icon icon='chevron-left' />
        </Link>
      ) : null}
      <div className='text'>
        <h1>{title}</h1>
        {(description) ? <p>{description}</p> : null}
      </div>
    </header>
  );
}

SectionHeader.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};
