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

    return (
      <PageList {...this.props} >
        <ListItem />
      </PageList>
    );
  }
}

const mapStateToProps = ({ reports }, ownProps) => {
  // Provide default parameters for list
  // ===========================================================================
  return {
    curId: parseInt(ownProps.params.id),
    type: 'report',
    sortable: false,
    deletable: true,
    texts: {
      title: 'Reports Management',
      description: 'Create, edit and delete reports that will be sent to you when specific columns get new items.',
      btn: 'Create new report',
      deleting: 'Are you sure want to delete this Report?',
      empty: 'No reports created yet. Use form above to create one.'
    },
    items: map(reports, (item) => {
      // Map items for list
      // ===========================================================================
      return {
        id: item.id,
        name: item.name,
        //counter: item.columns.length
      }
    })
  }
}

// Map actions for list and item
// ===========================================================================
const mapDispatchToProps = createListActions();

export default connect(mapStateToProps, mapDispatchToProps)(List);