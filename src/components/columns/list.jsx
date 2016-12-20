// Import react related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pick } from 'lodash';

// Import child components
// ===========================================================================
import PageList from '../pageList';
import ListItem from '../listItem';
import Icon from '../icon';

// Import actions
// ===========================================================================
import { createData, updateData, deleteData, throwError } from '../../actions/actions';

class List extends React.Component {
  constructor(props) {
    super(props);

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      createData: createData('column'),
      updateData: updateData('column'),
      deleteData: deleteData('column'),
      throwError: throwError
    }, this.props.dispatch);

    this.changeVis = this.changeVis.bind(this);
    this.getItemIcon = this.getItemIcon.bind(this);
  }

  // Change visibility filter
  // ===========================================================================
  changeVis (data) {
    this.actions.updateData(data).catch(this.actions.throwError);
  }

  // Generate visibility icon
  // ===========================================================================
  getItemIcon (props) {
    let title, params, icon;
    console.log(props);
    if (props.open) {
      title = 'Hide this Column';
      icon = 'eye-with-line';
      params = {id: props.id, open: 0};
    } else {
      title = 'Show this Column';
      icon = 'eye';
      params = {id: props.id, open: 1};
    }

  return <a href='' onClick={e => {e.preventDefault(); this.changeVis(params)}} title={title}><Icon icon={icon} /></a>;
  }

  render() {
    // Define common text values
    // ===========================================================================
    let texts = {
      title: 'Columns Management',
      description: 'Create, edit or delete dashboard columns. Drag to reorder, use the eye icon to hide/unhide them (tip: hidden columns can still be used for alerts/reports).',
      btn: 'Create new column',
      deleting: 'Are you sure want to delete this Column?',
      empty: 'No columns created yet. Use form above to create one.'
    };

    return (
      <PageList {...this.actions} texts={texts} {...this.props} >
        <ListItem customIcon={this.getItemIcon} />
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
    items: columns.map((item) => pick(item, ['id', 'name', 'open']))
  }
}

export default connect(mapStateToProps)(List);