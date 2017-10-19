// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import DragHandle from 'common/components/drag-handle';

// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { childrenShape } from 'common/typecheck';

// Agnostinc list item component
// @using by: ListView and Management views
// ===========================================================================
export default function Feed({ className, url, type, sortable, children, name }) {
  return (
    <li className={classNames('mod-entity', className)}>
      <div>
        { (sortable) ? <DragHandle /> : null }
        <div className='text'>
          <span className='title'>
            <b>Name: </b>
            <em className='badge' data-type={type}>{type}</em>
            <span title={name}> {name}</span>
          </span>
          <span className='url'>
            <b>Url: </b>
            <a href={url} title={url} target='_blank'>{url}</a>
          </span>
        </div>
        {(children) ? (
          <nav className='nav-links'>{children}</nav>
        ) : null}
      </div>
    </li>
  );
}

Feed.defaultProps = {
  sortable: true
};

Feed.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  sortable: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: childrenShape
};
