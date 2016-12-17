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
      title: 'Alerts Management',
      description: 'Create, edit and delete alerts that will be sent to you when specific columns get new items.',
      btn: 'Create new alert',
      deleting: 'Are you sure want to delete this Alert?',
      empty: 'No alerts created yet. Use form above to create one.'
    };

    return (
      <PageList texts={texts} {...this.props} >
        <ListItem />
      </PageList>
    );
  }
}

const mapStateToProps = ({ alerts }, ownProps) => {
  // Provide default parameters for list
  // ===========================================================================
  return {
    curId: parseInt(ownProps.params.id),
    type: 'alert',
    sortable: false,
    deletable: true,
    create: 'delayed',
    items: map(alerts, (item) => {
      // Map items for list
      // ===========================================================================
      return {
        id: item.id,
        name: item.name
      }
    })
  }
}

// Map actions for list and item
// ===========================================================================
const mapDispatchToProps = createListActions();

export default connect(mapStateToProps, mapDispatchToProps)(List);