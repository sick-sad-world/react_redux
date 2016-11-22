import { map } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import PageList from '../pageList';
import ListItem from '../listItem';

class List extends React.Component {
  render() {
    console.log('Alert list update');
    return (
      <PageList { ...this.props }>
        <ListItem />
      </PageList>
    );
  }
}

function mapStateToProps ({ alerts }) {
  let items = map(alerts, (item) => {
     return {
       id: item.id,
       name: item.name,
       counter: item.columns.length,
       draggable: true,
       type: 'alerts'
     }
  });
  return {
    items: items,
    texts: {
      title: 'Alerts Management',
      description: 'Create, edit and delete alerts that will be sent to you when specific columns get new items.',
      btn: 'Create new alert',
      deleting: 'Are you sure want to delete this Alert?',
      empty: 'No alerts created yet. Use form above to create one.'
    }
  };
}

export default connect(mapStateToProps)(List);