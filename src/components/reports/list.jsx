import { map } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import PageList from '../pageList';
import ListItem from '../listItem';

class List extends React.Component {
  render() {
    return (
      <PageList { ...this.props }>
        <ListItem/>
      </PageList>
    );
  }
}

function mapStateToProps ({ reports }) {
  let items = map(reports, (item) => {
     return {
       id: item.id,
       name: item.name,
       counter: item.columns.length,
       draggable: true,
       type: 'reports'
     }
  });
  return {
    items: items,
    type: 'reports',
    texts: {
      title: 'Reports Management',
      description: 'Create, edit and delete reports that will be sent to you when specific columns get new items.',
      btn: 'Create new report',
      deleting: 'Are you sure want to delete this Report?',
      empty: 'No reports created yet. Use form above to create one.'
    }
  };
}

export default connect(mapStateToProps)(List);