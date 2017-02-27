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
        <ListItem type='report' />
      </PageList>
    );
  }
}

// Define common text values
// ===========================================================================
List.defaultProps = {
  texts: {
    title: 'Reports Management',
    description: 'Create, edit and delete reports that will be sent to you when specific columns get new items.',
    btn: 'Create new report',
    deleting: 'Are you sure want to delete this Report?',
    empty: 'No reports created yet. Use form above to create one.'
  }
};

// Provide default parameters for list
// ===========================================================================
const mapStateToProps = ({ reports, app }, ownProps) => {
  return {
    state: app.state,
    curId: parseInt(ownProps.params.id),
    sortable: false,
    deletable: true,
    type: 'report',
    create: 'delayed',
    items: reports.map((item) => ({
      id: item.id,
      order: item.order,
      name: item.name
    }))
  }
}

export default connect(mapStateToProps)(List);