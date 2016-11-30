import { map } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

import { createData, deleteData, throwError } from '../../actions/actions';

import PageList from '../pageList';
import ListItem from '../listItem';

class List extends React.Component {

  handlerSubmit (e) {
    e.preventDefault();
    let dispatch = this.props.dispatch;
    let input = e.target.elements.name;
    dispatch(createData(this.props.type)({
        name: input.value,
        order: this.props.items.length
      }))
      .then(() => { input.value = ''; })
      .catch((error) => dispatch(throwError(error)));
  }

  handlerDelete (id, e) {
    e.preventDefault();
    let dispatch = this.props.dispatch;
    dispatch(deleteData(this.props.type)({
      id: id
    })).catch((error) => dispatch(throwError(error)));
  }

  render() {
    let { items, texts } = this.props;
    return (
      <PageList items={items} texts={texts} handlerSubmit={this.handlerSubmit.bind(this)} >
        <ListItem handlerDelete={this.handlerDelete.bind(this)} />
      </PageList>
    );
  }
}

const mapStateToProps = ({ alerts }) => {
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
  return {
    items: items,
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

export default connect(mapStateToProps)(List);