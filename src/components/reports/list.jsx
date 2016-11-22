import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import PageList from '../pageList';
import Item from './item';

class List extends React.Component {

  render() {
    console.log('Report list update');
    return (
      <PageList type='reports' texts={this.props.texts} items={this.props.items} composeListItem={Item} />
    );
  }
}

let mapStateToProps = ({ reports }) => ({
  items: _.map(reports, (item) => _.pick(item, ['id', 'name', 'columns'])),
  texts: {
    title: 'Reports Management',
    description: 'Create, edit and delete reports that will be sent to you when specific columns get new items.',
    btn: 'Create new report',
    deleting: 'Are you sure want to delete this Report?',
    empty: 'No reports created yet. Use form above to create one.'
  }
});

export default connect(mapStateToProps)(List);