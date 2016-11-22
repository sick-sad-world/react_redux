import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import PageList from '../pageList';
import Item from './item';

class List extends React.Component {
  render() {
    console.log('Column list update');
    return (
      <PageList type='columns' texts={this.props.texts} items={this.props.items} composeListItem={Item} />
    );
  }
}

let mapStateToProps = ({ columns }) => ({
  items: _.map(columns, (item) => _.pick(item,['id', 'name', 'open'])),
  texts: {
    title: 'Columns Management',
    description: 'Create, edit or delete dashboard columns. Drag to reorder, use the eye icon to hide/unhide them (tip: hidden columns can still be used for alerts/reports).',
    btn: 'Create new column',
    deleting: 'Are you sure want to delete this Column?',
    empty: 'No columns created yet. Use form above to create one.'
  }
});

export default connect(mapStateToProps)(List);