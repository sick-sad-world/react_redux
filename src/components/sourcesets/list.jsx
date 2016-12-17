// Import react related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';
import { map } from 'lodash';

// Import actions
// ===========================================================================
import createListActions from '../../helpers/listActions';

// Import child components
// ===========================================================================
import PageList from '../pageList';
import ListItem from '../listItem';

class List extends React.Component {
  render() {
    let texts = {
      title: 'Sources Management',
      description: 'Create, edit and delete sets of sources. Drag to reorder list. Open set to edit the sources in it.',
      btn: 'Create new sourceset',
      deleting: 'Are you sure want to delete this Sourceset?',
      empty: 'No sourcesets created yet. Use form above to create one.'
    };
    
    return (
      <PageList texts={texts} {...this.props} >
        <ListItem />
      </PageList>
    );
  }
}

const mapStateToProps = ({ sets }, ownProps) => {
  // Provide default parameters for list
  // ===========================================================================
  return {
    curId: parseInt(ownProps.params.id),
    type: 'set',
    sortable: false,
    deletable: true,
    items: map(sets, (item) => {
      // Map items for list
      // ===========================================================================
      return {
        id: item.id,
        name: item.name,
        counter: item.source_ids.length
      }
    })
  }
}

// Map actions for list and item
// ===========================================================================
const mapDispatchToProps = createListActions();

export default connect(mapStateToProps, mapDispatchToProps)(List);