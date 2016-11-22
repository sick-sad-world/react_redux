import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import PageList from '../pageList';
import Item from './item';

class List extends React.Component {
  render() {
    console.log('Alert list update');
    return (
      <PageList type='alerts' texts={this.props.texts} items={this.props.items} composeListItem={Item} />
    );
  }
}

let mapStateToProps = ({ alerts }) => ({
  items: _.map(alerts, (item) => _.pick(item, ['id', 'name', 'columns'])),
  texts: {
    title: 'Alerts Management',
    description: 'Create, edit and delete alerts that will be sent to you when specific columns get new items.',
    btn: 'Create new alert',
    deleting: 'Are you sure want to delete this Alert?',
    empty: 'No alerts created yet. Use form above to create one.'
  }
});

export default connect(mapStateToProps)(List);