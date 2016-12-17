// Import react related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';
import { map } from 'lodash';

// Import actions
// ===========================================================================
import createListActions from '../../helpers/listActions';
import { updateData, throwError } from '../../actions/actions';

// Import child components
// ===========================================================================
import PageList from '../pageList';
import ListItem from '../listItem';
import Icon from '../icon';

class List extends React.Component {
  // Change visibility filter
  // ===========================================================================
  changeVis (data, e) {
    e.preventDefault();
    let dispatch = this.props.dispatch;
    dispatch(updateData(this.props.type)(data)).catch((error) => dispatch(throwError(error)));
  }

  // Generate visibility icon
  // ===========================================================================
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
    let texts = {
      title: 'Columns Management',
      description: 'Create, edit or delete dashboard columns. Drag to reorder, use the eye icon to hide/unhide them (tip: hidden columns can still be used for alerts/reports).',
      btn: 'Create new column',
      deleting: 'Are you sure want to delete this Column?',
      empty: 'No columns created yet. Use form above to create one.'
    };

    return (
      <PageList texts={texts} {...this.props} >
        <ListItem customIcon={this.getItemIcon.bind(this)} />
      </PageList>
    );
  }
}

const mapStateToProps = ({ columns }, ownProps) => {
  // Provide default parameters for list
  // ===========================================================================
  return {
    curId: parseInt(ownProps.params.id),
    type: 'column',
    sortable: false,
    deletable: true,
    items: map(columns, (item) => {
      // Map items for list
      // ===========================================================================
      return {
        id: item.id,
        name: item.name
      }
    })
  }
}

// Map actions for list and item
// ===========================================================================
const mapDispatchToProps = createListActions();

export default connect(mapStateToProps, mapDispatchToProps)(List);