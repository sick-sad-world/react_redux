import { map } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

import { createData, deleteData, updateData, throwError } from '../../actions/actions';

import PageList from '../pageList';
import ListItem from '../listItem';
import Icon from '../icon';

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

  changeVis (data, e) {
    e.preventDefault();
    let dispatch = this.props.dispatch;
    dispatch(updateData(this.props.type)(data)).catch((error) => dispatch(throwError(error)));
  }

  getItemIcon (props) {
    let title, params, icon;
    
    if (props.open) {
      title = 'Hide this Column';
      icon = 'eye-with-line';
      params = {id: props.id, open: 0};
    } else {
      title = 'Show this Column';
      icon = 'eye';
      params = {id: props.id, open: 1};
    }

    return <a href='' onClick={this.changeVis.bind(this, params)} title={title}><Icon icon={icon} /></a>;
  }

  render() {
    let { items, texts } = this.props;
    return (
      <PageList items={items} texts={texts} handlerSubmit={this.handlerSubmit.bind(this)} >
        <ListItem handlerDelete={this.handlerDelete.bind(this)} customIcon={this.getItemIcon.bind(this)}/>
      </PageList>
    );
  }

}

const mapStateToProps = ({ columns }) => {
  let items = map(columns, (item) => {
     return {
       id: item.id,
       name: item.name,
       open: item.open,
       draggable: true,
       deletable: true,
       type: 'column'
     }
  });

  return {
    items: items,
    type: 'column',
    texts: {
      title: 'Columns Management',
      description: 'Create, edit or delete dashboard columns. Drag to reorder, use the eye icon to hide/unhide them (tip: hidden columns can still be used for alerts/reports).',
      btn: 'Create new column',
      deleting: 'Are you sure want to delete this Column?',
      empty: 'No columns created yet. Use form above to create one.'
    }
  };
}

export default connect(mapStateToProps)(List);