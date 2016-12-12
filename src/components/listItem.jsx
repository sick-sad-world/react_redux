// Import React related stuff
// ===========================================================================
import React from 'react';
import Icon from './icon';
import { Link } from 'react-router';

// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { bindAll } from 'lodash';

export default class ListItem extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      deleting: false
    }
    bindAll(this, ['stateDelete', 'handlerDelete']);
  }

  stateDelete (e) {
    e.preventDefault();
    this.setState({
      deleting: !this.state.deleting
    });
  }

  handlerDelete (e) {
    e.preventDefault();
    this.props.actionDelete(this.props.type, this.props.id);
  }

  render() {
    let { current, type, id, name, counter, draggable, deletable } = this.props;

    let rootClasses = classNames({
      'mod-entity': true,
      'is-selected': current
    })

    let dragHandler = (draggable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null;
    let badge = (counter) ? <em className='counter'>{counter}</em> : null;
    let customIcon = (this.props.customIcon) ? this.props.customIcon(this.props) : null;
    let deleteBtn = (deletable) ? <a href='' onClick={this.stateDelete} title={`Delete this ${type}`}><Icon icon='trash' /></a> : null;
    let confimation = (deletable && this.state.deleting) ? <a href='' onClick={this.handlerDelete} className='confirmation'>Delete</a> : null;
    
    return (
      <li className={rootClasses}>
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