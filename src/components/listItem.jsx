import React from 'react';
import Icon from './icon';
import { Link } from 'react-router';

export default class ListItem extends React.PureComponent {
  render() {
    let { type, id, name, counter, draggable} = this.props;

    let dragHandler = (draggable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null;
    let badge = (counter) ? <em className="counter">{counter}</em> : null;
    let customIcon = (this.props.customIcon) ? this.props.customIcon(this.props) : null;
    
    return (
      <li className='mod-entity'>
        <div>
          {dragHandler}
          <div className='text'>
            <Link to={`/${type}/${id}`}>{badge} {name}</Link>
          </div>
          <nav className='nav-links'>
            {customIcon}
            <a href='#deleteItem' title={`Delete this ${type.substring(0, type.length - 1)}`}>
              <Icon icon='trash' />
            </a>
          </nav>
        </div>
      </li>
    );
  }
}