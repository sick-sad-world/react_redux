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
import { optionShape, listShape } from 'common/typecheck';
import { coreInterface, defaultTimeFormat, defaultFrequency } from './defaults';
import { makeDropdownSelector } from 'src/columns';
import { makeContainerSelector } from './selectors';

// Import actions
// ===========================================================================
import { editReport, deleteReport, createReport, sortReports } from './actions';

// Import Child components
// ===========================================================================
import Container from 'common/components/container';
import EditReport from './components/edit';

class Reports extends React.Component {
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
        <dt>Trendolizer report</dt>
        <dd>{`ID: ${deleting.id} - ${deleting.name}. ${text}`}</dd>
      </dl>
    );
  }

  render() {
    return (
      <Container {...this.props} callOnCreate={false} confText={this.confText}>
        {(this.props.chosen) ? props => <EditReport {...props} formProps={{
          columns: this.props.columns,
          timeFormat: defaultTimeFormat,
          frequencyOptions: defaultFrequency
        }} /> : null}
      </Container>
    );
  }
}

Reports.defaultProps = {
  listItemOpts: {
    deleteText: 'Delete this report'
  },
  listSectionOpts: {
    texts: {
      title: 'Reports Management',
      description: 'Create, edit and delete reports that will be sent to you when specific columns get new items.',
      btn: 'Create new report',
      placeholder: 'Enter name',
      deleting: 'Are you sure want to delete this Report?',
      empty: 'No reports created yet. Use form above to create one.'
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

Reports.propTypes = {
  columns: optionShape('number'),
  payload: PropTypes.arrayOf(PropTypes.shape(listShape)).isRequired,
  chosen: PropTypes.shape(coreInterface),
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

export default connect(mapStateToProps(), {
  actionSort: sortReports,
  actionCreate: createReport,
  actionEdit: editReport,
  actionDelete: deleteReport
})(Reports);
