import React from 'react';
import PropTypes from 'prop-types';
import List from '../DragNDrop/List';
import ListItem from '../DragNDrop/Item'
import './style.scss';

export default class Assignment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <section>
        <div>
        </div>
        <List droppableId='choises' type='choises' className='list-container'>
          {choises.map(() => ())}
        </List>
      </section>
    );
  }
}