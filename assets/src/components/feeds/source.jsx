// Import React related stuff
// ===========================================================================
import React from 'react';
import Icon from '../icon';

// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Agnostinc list item component
// @using by: ListView and Management views
// ===========================================================================
export default class Source extends React.PureComponent {
  render() {
    let { disabled, url, type, sortable, button, name } = this.props;
    
    return (
      <li className={classNames({
        'mod-entity': true,
        'is-disabled': disabled
      })}>
        <div>
          { (sortable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null }
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
          { (button) ? (<nav className='nav-links'>{button}</nav>) : null }
        </div>
      </li>
    );
  }
}