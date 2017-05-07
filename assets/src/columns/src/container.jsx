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
import { stateNum } from 'common/typecheck';
import { coreInterface } from './defaults';
import { makeContainerSelector } from './selectors';

// Import actions
// ===========================================================================
import { bindActionCreators } from 'redux';
import { createColumn, editColumn, deleteColumn } from './actions';

// Import Child components
// ===========================================================================
import Container from 'common/components/container';
import { ToggleVisibility } from './components/buttons';
import EditColumn from './components/edit';
import ColumnFeedsAssignment from './components/assignment';

class Columns extends React.Component {
  constructor(props) {
    super(props);
    this.state = { deleting: null };
    bindAll(this, 'confText', 'makeItemIcon');
  }

  makeItemIcon({ id, open }) {
    return <ToggleVisibility open={open} handler={() => this.props.actionEdit({ id, open: (open) ? 0 : 1 })} />;
  }

  confText(deleting) {
    return (
      <dl>
        <dt>Trendolizer Column</dt>
        <dd>{`ID: ${deleting.id} - ${deleting.name}.`}</dd>
      </dl>
    );
  }

  render() {
    return (
      <Container {...this.props} listItemOpts={{
        deleteText: 'Delete this column',
        customIcon: this.makeItemIcon
      }} confText={this.confText}>
        {(this.props.chosen && !this.props.params.assignment) ? props => <EditColumn {...props} /> : null}
        {/* (this.props.chosen && this.props.params.assignment) ? (
          <ColumnFeedsAssignment
            data={this.props.chosen}
            state={this.props.state}
            update={this.updateItem}
            backPath={`${this.props.route.path}/${this.props.curId}`}
          />
        ) : null}*/}
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
  }
};

Columns.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.shape(coreInterface)).isRequired,
  params: PropTypes.object.isRequired,
  chosen: PropTypes.object,
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    actionCreate: createColumn,
    actionEdit: editColumn,
    actionDelete: deleteColumn
  }, dispatch);
}

export default connect(mapStateToProps(), mapDispatchToProps)(Columns);
