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

  textRenderer (props) {
    // Make сounter
    // ===========================================================================
    let badge = (props.counter) ? <em className='counter'>{props.counter}</em> : null;

    // Return text node
    // ===========================================================================
    return (<div className='text'><Link to={`/${props.type}s/${props.id}`}>{ badge } { props.name }</Link></div>);
  }

  render() {
    let { disabled, current, type, sortable, deletable } = this.props;

    // Root element classes
    // ===========================================================================
    let rootClasses = classNames({
      'mod-entity': true,
      'is-selected': current && !disabled,
      'is-disabled': disabled && !current
    })

    // Drag handle 
    // ===========================================================================
    let dragHandle = (sortable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null;

    // Create text node
    // ===========================================================================
    let text = (this.props.textRenderer) ? this.props.textRenderer(this.props) : this.textRenderer(this.props);

    // Make custom icon
    // @show/hide column for example
    // ===========================================================================
    let customIcon = (this.props.customIcon) ? this.props.customIcon(this.props) : null;

    // Make delete button if item deletable
    // ===========================================================================
    let deleteBtn = (deletable) ? (
      <a href='' onClick={e => {
        e.preventDefault();
        let coord = window.outerHeight - e.target.getBoundingClientRect().bottom - e.target.parentNode.clientHeight;
        this.props.stateDelete(this.props.id, coord);
      }} title={`Delete this ${type}`}>
        <Icon icon='trash' />
      </a>
    ) : null;
    
    return (
      <li className={rootClasses}>
        <div>
          { dragHandle }
          { text }
          {(customIcon || deleteBtn) ? (<nav className='nav-links'>
            { customIcon }
            { deleteBtn }
          </nav>) : null }
        </div>
        {this.props.children}
      </li>
    );
  }
}