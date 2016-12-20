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
    let { id, expanded, sortable, name, source_ids, expandHandler, selectHandler } = this.props;

    // Root element classes
    // ===========================================================================
    let rootClasses = classNames({
      'mod-entity': true,
      'mod-sourceset': true,
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
          <nav className='nav-links'>
            <a href="" onClick={e => {
              e.preventDefault();
              selectHandler('set', id);
            }} title='Add this set to selection'><Icon icon='reply-all' /></a>
            <a href="" onClick={e => {
              e.preventDefault();
              expandHandler((expanded) ? 0 : id);
            }} title='View contents'><Icon icon={(expanded) ? 'chevron-up' : 'chevron-down'} /></a>
          </nav>
        </div>
        {(this.props.children) ? <ul className='entity-list'>{this.props.children}</ul> : null}
      </li>
    );
  }
}