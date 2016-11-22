import { map } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';
import PageList from '../pageList';
import ListItem from '../listItem';
import Icon from '../icon';

class List extends React.Component {
  changeVis (e) {
    e.preventDefault();
  }

  getItemIcon (props) {
    if (props.open) {
      return <a href='#toggleVis' onClick={this.changeVis.bind(this)} title='Hide this Column'><Icon icon='eye-with-line' /></a>;
    } else {
      return <a href='#toggleVis' onClick={this.changeVis.bind(this)} title='Show this Column'><Icon icon='eye' /></a>;
    }
  }

  render() {
    console.log('Column list update');
    return (
      <PageList type='columns' texts={this.props.texts} items={this.props.items}>
        <ListItem customIcon={this.getItemIcon.bind(this)}/>
      </PageList>
    );
  }
}

function mapStateToProps ({ columns }) {
  let items = map(columns, (item) => {
     return {
       id: item.id,
       name: item.name,
       open: item.open,
       draggable: true,
       type: 'columns'
     }
  });
  return {
    items: items,
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