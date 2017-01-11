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
    let { expanded, sortable, name, source_ids, buttons, disabled } = this.props;

    // Root element classes
    // ===========================================================================
    let rootClasses = classNames({
      'mod-entity': true,
      'mod-sourceset': true,
      'is-disabled': disabled,
      'is-expanded': expanded
    });
    
    return (
      <li className={rootClasses}>
        <div>
          { (sortable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null }
          <div className='text'>
            <span className='title'>
              <em className='counter'>{source_ids.length}</em> { name }
            </span>
          </div>
          { (buttons && buttons.length) ? <nav className='nav-links'>{buttons}</nav> : null }
        </div>
        {(this.props.children) ? <ul className='entity-list'>{this.props.children}</ul> : null}
      </li>
    );
  }
}