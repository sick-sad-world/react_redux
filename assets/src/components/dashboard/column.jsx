// Import utility stuff
// ===========================================================================
import { bindAll, find } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Import Child components
// ===========================================================================
import Header from './header';
import Settings from './settings';

// Component for a single column
// ===========================================================================
export default class Column extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
    bindAll(this, 'toggleExpanded');
  }

  toggleExpanded() {
    this.setState({expanded: !this.state.expanded});
  }

  render () {
    return (
      <section key={column.id} className='mod-column'>
        <Header name={column.name} refresh={this.refreshResults(column.id)} settings={this.toggleExpanded} />
        {(this.state.expanded === column.id) ? (
          <Settings
            id={column.id}
            running={this.props.state > 2}
            onChange={this.updateItem}
            hideItem={this.hideItem(column.id)}
            deleteItem={this.makeDeleteToggler(column.id)}
            sort={column.data.sort}
            direction={column.data.direction}
            infinite={column.data.infinite}
            autoreload={column.data.autoreload}
          />
        ) : null }
        {this.props.children}
      </section>
    );
  }
}