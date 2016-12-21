// Import react related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';
import { map } from 'lodash';

// Import child components
// ===========================================================================
import PageList from '../pageList';
import ListItem from '../listItem';

class List extends React.Component {
  render() {
    // Define common text values
    // ===========================================================================
    let texts = {
      title: 'Reports Management',
      description: 'Create, edit and delete reports that will be sent to you when specific columns get new items.',
      btn: 'Create new report',
      deleting: 'Are you sure want to delete this Report?',
      empty: 'No reports created yet. Use form above to create one.'
    };
    
    return (
      <PageList texts={texts} {...this.props} >
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
    create: 'delayed',
    items: map(reports, (item) => {
      // Map items for list
      // ===========================================================================
      return {
        id: item.id,
        name: item.name
      }
    })
  }
}

export default connect(mapStateToProps)(List);