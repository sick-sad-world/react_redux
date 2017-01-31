// Import react related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bindAll } from 'lodash';

// Import actions
// ===========================================================================
import { createAction, throwError } from '../../actions/actions';

// Import child components
// ===========================================================================
import PageList from '../pageList';
import ListItem from '../listItem';
import Icon from '../icon';

class List extends React.Component {
  constructor(props) {
    super(props);
    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      update: createAction(this.props.type, 5),
      throwError: throwError
    }, this.props.dispatch);
    bindAll(this, ['makeVisHandler', 'makeItemIcon']);
  }

  // Change visibility filter
  // ===========================================================================
  makeVisHandler (data) {
    return () => {
      this.actions.update(data).catch(this.actions.throwError);
    }
  }

  // Generate visibility icon
  // ===========================================================================
  makeItemIcon (props) {
    let { id, open } = props;
    let visIconData = this.props.visIconData;
    return <a onClick={this.makeVisHandler({id, open: (open) ? 0 : 1})} title={visIconData[open].title}><Icon icon={visIconData[open].icon} /></a>;
  }

  render() {
    return (
      <PageList {...this.props} >
        <ListItem type='column' customIcon={this.makeItemIcon} />
      </PageList>
    );
  }
}

// Define common text values
// ===========================================================================
List.defaultProps = {
  texts: {
    title: 'Columns Management',
    description: 'Create, edit or delete dashboard columns. Drag to reorder, use the eye icon to hide/unhide them (tip: hidden columns can still be used for alerts/reports).',
    btn: 'Create new column',
    deleting: 'Are you sure want to delete this Column?',
    empty: 'No columns created yet. Use form above to create one.'
  },
  visIconData: [{icon: 'eye', title: 'Show this column'}, {icon: 'eye-with-line', title: 'Hide this column'}]
};

// Provide default parameters for list
// ===========================================================================
const mapStateToProps = ({ columns, app }, ownProps) => {
  return {
    state: app.state,
    curId: parseInt(ownProps.params.id),
    sortable: false,
    deletable: true,
    type: 'columns',
    items: columns.map((item) => ({
      id: item.id,
      order: item.order,
      name: item.name,
      open: item.open
    }))
  }
}

export default connect(mapStateToProps)(List);