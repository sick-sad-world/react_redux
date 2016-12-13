// Import React related stuff
// ===========================================================================
import React from 'react';
import Icon from './icon';
import { Link } from 'react-router';

// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Agnostinc list item component
// @using by: ListView and Management views
// ===========================================================================
export default class ListItem extends React.PureComponent {

  render() {
    let { current, type, id, name, counter, sortable, deletable } = this.props;

    // Root element classes
    // ===========================================================================
    let rootClasses = classNames({
      'mod-entity': true,
      'is-selected': current
    })

    // Drag handle 
    // ===========================================================================
    let dragHandle = (sortable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null;

    // Make сounter
    // ===========================================================================
    let badge = (counter) ? <em className='counter'>{counter}</em> : null;

    // Make custom icon
    // @show/hide column for example
    // ===========================================================================
    let customIcon = (this.props.customIcon) ? this.props.customIcon(this.props) : null;

    // Make delete button if item deletable
    // ===========================================================================
    let deleteBtn = (deletable) ? (
      <a href='' onClick={e => {
        e.preventDefault();
        console.log(window.outerHeight, e.target.getBoundingClientRect().bottom, e.target.parentNode.clientHeight);
        let coord = window.outerHeight - e.target.getBoundingClientRect().bottom - e.target.parentNode.clientHeight * 1.5;
        this.props.stateDelete(this.props.id, coord);
      }} title={`Delete this ${type}`}>
        <Icon icon='trash' />
      </a>
    ) : null;
    
    return (
      <li className={rootClasses}>
        <div>
          { dragHandle }
          <div className='text'>
            <Link to={`/${type}s/${id}`}>{ badge } { name }</Link>
          </div>
          <nav className='nav-links'>
            { customIcon }
            { deleteBtn }
          </nav>
        </div>
      </li>
    );
  }
}