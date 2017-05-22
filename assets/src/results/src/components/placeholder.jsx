import { includes } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { displaySettings as defs } from '../defaults';

// Result placeholder component
// ===========================================================================
export default function Placeholder({ sort, displaySettings }) {
  return (
    <article className='mod-result is-placeholder'>
      <aside></aside>
      <div className="content">
        <header>
          <span className='comparator'>{sort}</span>
          <h1>
            <span className='line'></span>
            <span className='line'></span>
            <span className='line short'></span>
          </h1>
        </header>
        {(includes(displaySettings, 'wide_image')) ? (
          <div className='gallery'>
            <span className='image'></span>
            <small>
              <span className='line short'></span>
              <span className='line short'></span>
            </small>
          </div>
        ) : (
          <div className='description'>
            <small>
              <span className='line short'></span>
              <span className='line short'></span>
            </small>
            {(includes(displaySettings, 'image')) ? (
              <span className='image'></span>
            ) : null }
            <p>
              <span className='line'></span>
              <span className='line'></span>
              <span className='line'></span>
              <span className='line'></span>
              <span className='line'></span>
              <span className='line'></span>
              <span className='line'></span>
              <span className='line'></span>
              <span className='line short'></span>
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

Placeholder.defaultProps = {
  sort: 'Found',
  displaySettings: [...defs.default]
};

Placeholder.propTypes = {
  sort: PropTypes.string.isRequired,
  displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired
};
