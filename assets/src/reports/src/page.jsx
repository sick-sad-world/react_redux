// Import utility stuff
// ===========================================================================

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { listShape, stateNum } from 'common/typecheck';
import { coreInterface, defaultTimeFormat } from './defaults';
import { makeContainerSelector } from './selectors';

// Import actions
// ===========================================================================
import { editReport, deleteReport, createReport, sortReports } from './actions';

// Import Child components
// ===========================================================================
import makePageContainer, { injectedProps } from 'common/hocs/container';
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/list';
import EditReport from './components/edit';

class ReportsPage extends React.Component {
  render() {
    const { listText, state, payload, createItem, deleteConfirm, deleteItem, editItem, editText, actionSort, chosen, loading, deleting, route, curId } = this.props;
    return (
      <div className='mod-page'>
        <ListSection
          loading={loading === 'creating'}
          payload={payload}
          state={state}
          createItem={createItem}
          deleteItem={deleteConfirm}
          sortItems={actionSort}
          texts={listText}
        >
          {props => (
            <ListItem
              {...props}
              url={route.path}
              current={curId}
              deleteText='Delete this report'
            />
          )}
        </ListSection>
        {(chosen) ? (
          <EditReport
            data={chosen}
            loading={loading === 'editing'}
            state={state}
            onSubmit={editItem}
            backUrl={route.path}
            texts={editText}
            timeFormat={defaultTimeFormat}
          />
        ) : null}
        {(deleting) ? (
          <DeleteConfirmation close={deleteConfirm()} loading={loading === 'deleting'} accept={deleteItem}>
            <dl>
              <dt>Are you sure you want to delete the report</dt>
              <dd>{`ID: ${deleting.id} - ${deleting.name}.`}</dd>
            </dl>
          </DeleteConfirmation>
        ) : null}
      </div>
    );
  }
}

ReportsPage.defaultProps = {
  state: 2,
  listText: {
    title: 'Reports Management',
    description: 'Create, edit and delete reports that will be sent to you when specific columns get new items.',
    btn: 'Create new report',
    placeholder: 'Enter name',
    deleting: 'Are you sure want to delete this Report?',
    empty: 'No reports created yet. Use form above to create one.'
  },
  editText: {
    title: 'Edit report',
    description: 'Pick the columns to send. Set time to send, e-mail recipient and report name here.',
    confirmation: '{data} were changed. Save changes?'
  }
};

ReportsPage.propTypes = {
  curId: PropTypes.number.isRequired,
  listText: PropTypes.objectOf(PropTypes.string).isRequired,
  editText: PropTypes.objectOf(PropTypes.string).isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(listShape)).isRequired,
  state: stateNum.isRequired,
  router: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  chosen: PropTypes.shape(coreInterface),
  ...injectedProps
};

// Connect our Container to State
// @ deps -> Reports
// ===========================================================================
export default connect(makeContainerSelector, {
  actionSort: sortReports,
  actionCreate: createReport,
  actionEdit: editReport,
  actionDelete: deleteReport
})(makePageContainer({ create: 'edit' }, ReportsPage));
