import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Icon from './icon';

// Edit form generic header component
// ===========================================================================
export function EditFormHeader({ title, description, url }) {
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

EditFormHeader.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};
