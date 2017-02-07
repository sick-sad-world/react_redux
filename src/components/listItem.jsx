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
    let { disabled, current, url, sortable, name, id, counter, order } = this.props;

    // Root element classes
    // ===========================================================================
    let rootClasses = classNames({
      'mod-entity': true,
      'is-selected': current === id && !disabled,
      'is-disabled': disabled && current !== id
    });

    // Drag handle 
    // ===========================================================================
    let dragHandle = (sortable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null;

    // Make custom icon
    // @show/hide column for example
    // ===========================================================================
    let customIcon = (this.props.customIcon) ? this.props.customIcon(this.props) : null;
    
    // Make сounter
    // ===========================================================================
    let badge = (counter >= 0) ? <em className='counter'>{counter}</em> : null;

    // Make delete button if item deletable
    // ===========================================================================
    let deleteBtn = (this.props.deleteAction) ? (<a onClick={this.props.deleteAction} title={this.props.deleteText}><Icon icon='trash' /></a>) : null;
    
    return (
      <li className={rootClasses} data-order={order}>
        <div>
          { dragHandle }
          <div className='text'>
            <Link to={ (current === id) ? url : url+'/'+id }>{ badge } { name }</Link>
          </div>
          {(customIcon || deleteBtn) ? (
            <nav className='nav-links'>
            { customIcon }
            { deleteBtn }
            </nav>
          ) : null }
        </div>
      </li>
    );
  }
}