import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import PageList from '../pageList';
import Item from './sourceset';

class List extends React.Component {

  render() {
    console.log('Sourceset list update');
    return (
      <PageList type='sourcesets' texts={this.props.texts} items={this.props.items} composeListItem={Item} />
    );
  }
}

let mapStateToProps = ({ sourcesets }) => ({
  items: _.map(sourcesets, (item) => _.pick(item, ['id', 'name', 'source_ids'])),
  texts: {
    title: 'Sources Management',
    description: 'Create, edit and delete sets of sources. Drag to reorder list. Open set to edit the sources in it.',
    btn: 'Create new sourceset',
    deleting: 'Are you sure want to delete this Sourceset?',
    empty: 'No sourcesets created yet. Use form above to create one.'
  }
});

export default connect(mapStateToProps)(List);