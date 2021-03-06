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
export default class Sourceset extends React.PureComponent {
  render() {
    let { expanded, sortable, name, counter, buttons, disabled } = this.props;

    let badge = (counter) ? <em className='counter'>{counter}</em> : null;
    
    return (
      <li className={classNames({
        'mod-entity': true,
        'mod-sourceset': true,
        'is-disabled': disabled,
        'is-expanded': expanded
      })}>
        <div>
          { (sortable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null }
          <div className='text'>
            <span className='title'>
              { badge } { name }
            </span>
          </div>
          { (buttons && buttons.length) ? <nav className='nav-links'>{buttons}</nav> : null }
        </div>
        {(this.props.children) ? <ul className='entity-list'>{this.props.children}</ul> : null}
      </li>
    );
  }
}