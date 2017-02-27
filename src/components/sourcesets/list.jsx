// Import react related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import child components
// ===========================================================================
import PageList from '../pageList';
import ListItem from '../listItem';

class List extends React.Component {
  render() {
    return (
      <PageList {...this.props} >
        <ListItem type='set' />
      </PageList>
    );
  }
}

// Define common text values
// ===========================================================================
List.defaultProps = {
  texts: {
    title: 'Sources Management',
    description: 'Create, edit and delete sets of sources. Drag to reorder list. Open set to edit the sources in it.',
    btn: 'Create new sourceset',
    deleting: 'Are you sure want to delete this Sourceset?',
    empty: 'No sourcesets created yet. Use form above to create one.'
  }
};

// Provide default parameters for list
// ===========================================================================
const mapStateToProps = ({ sets, app }, ownProps) => {
  return {
    state: app.state,
    curId: parseInt(ownProps.params.id),
    sortable: false,
    deletable: true,
    type: 'set',
    items: sets.map((item) => ({
      id: item.id,
      order: item.order,
      name: item.name,
      counter: item.source_ids.length
    }))
  }
}

export default connect(mapStateToProps)(List);