// Import utility stuff
// ===========================================================================
import { bindAll, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { listShape } from 'common/typecheck';
import { coreInterface } from './defaults';
import { makeContainerSelector } from './selectors';

// Import actions
// ===========================================================================
import { editAlert, deleteAlert, createAlert, sortAlerts } from './actions';

// Import Child components
// ===========================================================================
import Container from 'common/components/container';
import EditAlert from './components/edit';

class Alerts extends React.Component {
  confText(deleting) {
    return (
      <dl>
        <dt>Trendolizer alert</dt>
        <dd>{`ID: ${deleting.id} - ${deleting.name}.`}</dd>
      </dl>
    );
  }

  render() {
    return (
      <Container {...this.props} callOnCreate={false} confText={this.confText}>
        {(this.props.chosen) ? props => <EditAlert {...props} /> : null}
      </Container>
    );
  }
}

Alerts.defaultProps = {
  listItemOpts: {
    deleteText: 'Delete this alert'
  },
  listSectionOpts: {
    texts: {
      title: 'Alerts Management',
      description: 'Create, edit and delete alerts that will be sent to you when specific columns get new items.',
      btn: 'Create new alert',
      placeholder: 'Enter name',
      deleting: 'Are you sure want to delete this Alert?',
      empty: 'No alerts created yet. Use form above to create one.'
    }
  },
  editOpts: {
    texts: {
      title: 'Edit report',
      description: 'Pick the columns to send. Set time to send, e-mail recipient and report name here.',
      confirmation: '{data} were changed. Save changes?'
    }
  }
};

Alerts.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.shape(listShape)).isRequired,
  chosen: PropTypes.shape(coreInterface),
  actionCreate: PropTypes.func.isRequired,
  actionEdit: PropTypes.func.isRequired,
  actionDelete: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Reports
// ===========================================================================
export default connect(makeContainerSelector, {
  actionSort: sortAlerts,
  actionCreate: createAlert,
  actionEdit: editAlert,
  actionDelete: deleteAlert
})(Alerts);
