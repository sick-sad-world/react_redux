// Import react related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import child components
// ===========================================================================
import PageList from '../pageList';
import ListItem from '../listItem';

class List extends React.Component {
  render() {
    return (
      <PageList {...this.props} >
        <ListItem />
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
const mapStateToProps = ({ sets }, ownProps) => {
  return {
    curId: parseInt(ownProps.params.id),
    type: 'set',
    sortable: false,
    deletable: true,
    items: sets.map((item) => ({
      id: item.id,
      name: item.name,
      counter: item.source_ids.length
    }))
  }
}

export default connect(mapStateToProps)(List);