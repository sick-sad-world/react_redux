import { map } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import PageList from '../pageList';
import ListItem from '../listItem';

class List extends React.Component {

  render() {
    console.log('Sourceset list update');
    return (
      <PageList { ...this.props }>
        <ListItem/>
      </PageList>
    );
  }
}

function mapStateToProps ({ sourcesets }) {
  let items = map(sourcesets, (item) => {
     return {
       id: item.id,
       name: item.name,
       counter: item.source_ids.length,
       draggable: true,
       type: 'sourcesets'
     }
  });
  return {
    items: items,
    type: 'sourcesets',
    texts: {
      title: 'Sources Management',
      description: 'Create, edit and delete sets of sources. Drag to reorder list. Open set to edit the sources in it.',
      btn: 'Create new sourceset',
      deleting: 'Are you sure want to delete this Sourceset?',
      empty: 'No sourcesets created yet. Use form above to create one.'
    }
  };
}

export default connect(mapStateToProps)(List);