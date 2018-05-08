import React from 'react';
import PropTypes from 'prop-types';

function List() {
  return (
    <Droppable>
      <ul>
        {children}
      </ul>
    </Droppable>
  )
}

function Item() {
  if (children) {
    return (
      <li>
        <Droppable>
          <div>
            // Content
          </div>
        </Droppable>
      </li>
    );
  } else {
    return (
      <li>
        <div>
          // Content
        </div>
      </li>
    );
  }
}

export default class DataList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  render() {
    const {data} = this.state;
    return (
      <div>
        <Context>
          <List>
            {data.map((i) => (
              <Draggable key={i}>
                <Item>
                  <List>
                    {data.map((i) => (
                      <Draggable key={i}>
                        <Item />
                      </Draggable>
                    ))}
                  </List>
                </Item>
              </Draggable>
            ))}
          </List>
        </Context>
      </div>
    );
  }
}