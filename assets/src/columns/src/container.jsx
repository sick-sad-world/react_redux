// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { coreInterface, editOptions } from './defaults';
import { makeContainerSelector } from './selectors';

// Import actions
// ===========================================================================
import { createColumn, editColumn, deleteColumn } from './actions';

// Import Child components
// ===========================================================================
import Container from 'common/components/container';
import { Show, Hide } from 'common/components/buttons';
import EditColumn from './components/edit';
import ColumnFeedsAssignment from './components/assignment';

class Columns extends React.Component {
  constructor(props) {
    super(props);
    this.state = { deleting: null };
    bindAll(this, 'confText', 'makeItemIcon', 'renderChildren');
  }

  changeColumnVis({ id, open }) {
    return () => this.props.actionEdit({ id, open: (open) ? 0 : 1 });
  }

  makeItemIcon(data) {
    return (data.open) ? <Hide handler={this.changeColumnVis(data)} /> : <Show handler={this.changeColumnVis(data)} />;
  }

  confText(deleting) {
    return (
      <dl>
        <dt>Trendolizer Column</dt>
        <dd>{`ID: ${deleting.id} - ${deleting.name}.`}</dd>
      </dl>
    );
  }

  renderChildren(props) {
    if (this.props.chosen) {
      if (this.props.params.assignment) {
        return <ColumnFeedsAssignment {...props} formProps={{ ...props.assignmentOpts }} />;
      }
      return <EditColumn {...props} className='mod-column-edit' formProps={{
        path: `${this.props.route.path}/${this.props.curId}`,
        ...editOptions
      }} />;
    }
    return null;
  }

  render() {
    return (
      <Container {...this.props} listItemOpts={{
        deleteText: 'Delete this column',
        customIcon: this.makeItemIcon
      }} confText={this.confText}>
        {this.renderChildren}
      </Container>
    );
  }
}

Columns.defaultProps = {
  listSectionOpts: {
    sortable: false,
    texts: {
      title: 'Columns Management',
      description: 'Create, edit or delete dashboard columns. Drag to reorder, use the eye icon to hide/unhide them (tip: hidden columns can still be used for alerts/reports).',
      btn: 'Create new column',
      placeholder: 'New column name',
      deleting: 'Are you sure want to delete this Column?',
      empty: 'No columns created yet. Use form above to create one.'
    }
  },
  editOpts: {
    texts: {
      title: 'Edit column',
      description: 'Select the type of items to show in this column and how to display them.',
      confirmation: '{data} was changed. Save changes?'
    }
  },
  assignmentOpts: {
    texts: {
      title: 'Assign feeds to column',
      description: 'Pick the sourcesets and sources this column to watch here.',
      confirmation: '{data} was changed. Save changes?'
    }
  }
};

Columns.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.shape(coreInterface)).isRequired,
  params: PropTypes.object.isRequired,
  curId: PropTypes.number,
  chosen: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  actionCreate: PropTypes.func.isRequired,
  actionEdit: PropTypes.func.isRequired,
  actionDelete: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
};

export default connect(mapStateToProps(), {
  actionEdit: editColumn,
  actionCreate: createColumn,
  actionDelete: deleteColumn
})(Columns);
