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
        <ListItem type='alert' />
      </PageList>
    );
  }
}

// Define common text values
// ===========================================================================
List.defaultProps = {
  texts: {
    title: 'Alerts Management',
    description: 'Create, edit and delete alerts that will be sent to you when specific columns get new items.',
    btn: 'Create new alert',
    deleting: 'Are you sure want to delete this Alert?',
    empty: 'No alerts created yet. Use form above to create one.'
  }
};

// Provide default parameters for list
// ===========================================================================
const mapStateToProps = ({ alerts, app }, ownProps) => {
  return {
    state: app.state,
    curId: parseInt(ownProps.params.id),
    sortable: false,
    deletable: true,
    type: 'alert',
    create: 'delayed',
    items: alerts.map((item) => ({
      id: item.id,
      order: item.order,
      name: item.name
    }))
  }
}

export default connect(mapStateToProps)(List);