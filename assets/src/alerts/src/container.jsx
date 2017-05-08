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
import { optionShape } from 'common/typecheck';
import { defaultFrequency, coreInterface } from './defaults';
import { makeContainerSelector } from './selectors';
import { makeDropdownSelector } from 'src/columns';

// Import actions
// ===========================================================================
import { bindActionCreators } from 'redux';
import { editAlert, deleteAlert, createAlert } from './actions';

// Import Child components
// ===========================================================================
import Container from 'common/components/container';
import EditAlert from './components/edit';

class Alerts extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'confText');
  }

  confText(deleting) {
    let text = '';
    if (this.props.columns) {
      const columns = this.props.columns.filter(({ value }) => includes(deleting.columns, value)).map(({ label }) => label);
      text = `Watching: ${(columns.length) ? columns.join(', ') : 'none'}`;
    }
    return (
      <dl>
        <dt>Trendolizer alert</dt>
        <dd>{`ID: ${deleting.id} - ${deleting.name}. ${text}`}</dd>
      </dl>
    );
  }

  render() {
    return (
      <Container {...this.props} callOnCreate={false} confText={this.confText}>
        {(this.props.chosen) ? props => <EditAlert {...props} formProps={{
          columns: this.props.columns,
          frequencyOptions: defaultFrequency
        }} /> : null}
      </Container>
    );
  }
}

Alerts.defaultProps = {
  listItemOpts: {
    deleteText: 'Delete this alert'
  },
  listSectionOpts: {
    sortable: false,
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
      confirmation: '{data} was changed. Save changes?'
    }
  }
};

Alerts.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.shape(coreInterface)).isRequired,
  columns: optionShape('number'),
  chosen: PropTypes.object,
  actionCreate: PropTypes.func.isRequired,
  actionEdit: PropTypes.func.isRequired,
  actionDelete: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Reports
// ===========================================================================
function mapStateToProps() {
  const selector = makeContainerSelector();
  if (makeDropdownSelector instanceof Function) {
    const columns = makeDropdownSelector();
    return (state, props) => ({
      columns: columns(state, props),
      ...selector(state, props)
    });
  }
  return (state, props) => selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    actionCreate: createAlert,
    actionEdit: editAlert,
    actionDelete: deleteAlert
  }, dispatch);
}

export default connect(mapStateToProps(), mapDispatchToProps)(Alerts);
