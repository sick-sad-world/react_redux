import React from 'react';
import Icon from './icon';
import { Link } from 'react-router';

export default class ListItem extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      deleting: false
    }
  }

  stateDelete (e) {
    e.preventDefault();
    this.setState({
      deleting: !this.state.deleting
    });
  }

  render() {
    let { type, id, name, counter, draggable, deletable, handlerDelete } = this.props;

    let dragHandler = (draggable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null;
    let badge = (counter) ? <em className='counter'>{counter}</em> : null;
    let customIcon = (this.props.customIcon) ? this.props.customIcon(this.props) : null;
    let deleteBtn = (deletable) ? <a href='' onClick={this.stateDelete.bind(this)} title={`Delete this ${type}`}><Icon icon='trash' /></a> : null;
    let confimation = (deletable && this.state.deleting) ? <a href='' onClick={(e) => handlerDelete(id, e)} className='confirmation'>Delete</a> : null;
    
    return (
      <li className='mod-entity'>
        <div>
          { dragHandler }
          <div className='text'>
            <Link to={`/${type}s/${id}`}>{ badge } { name }</Link>
          </div>
          <nav className='nav-links'>
            { customIcon }
            { deleteBtn }
          </nav>
          { confimation }
        </div>
      </li>
    );
  }
}