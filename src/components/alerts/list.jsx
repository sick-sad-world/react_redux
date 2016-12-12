import { map, pick } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import createListActions from '../../helpers/listActions';
import PageList from '../pageList';
import ListItem from '../listItem';

class List extends React.Component {
  render() {
    // Compose list data
    // ===========================================================================
    let listData = pick(this.props, ['curId', 'type', 'texts', 'items', 'actionCreate']);

    return (
      <PageList {...listData} >
        <ListItem actionDelete={this.props.actionDelete} />
      </PageList>
    );
  }
}

const mapStateToProps = ({ alerts }, ownProps) => {
  // Map items for list
  // ===========================================================================
  let items = map(alerts, (item) => {
     return {
       id: item.id,
       name: item.name,
       counter: item.columns.length,
       draggable: true,
       deletable: true,
       type: 'alert'
     }
  });

  // Provide default parameters for list
  // ===========================================================================
  return {
    items: items,
    curId: parseInt(ownProps.params.id),
    type: 'alert',
    texts: {
      title: 'Alerts Management',
      description: 'Create, edit and delete alerts that will be sent to you when specific columns get new items.',
      btn: 'Create new alert',
      deleting: 'Are you sure want to delete this Alert?',
      empty: 'No alerts created yet. Use form above to create one.'
    }
  };
}

// Map actions for list and item
// ===========================================================================
const mapDispatchToProps = createListActions();

export default connect(mapStateToProps, mapDispatchToProps)(List);