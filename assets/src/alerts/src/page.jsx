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
import { coreInterface } from './defaults';
import { makeContainerSelector } from './selectors';

// Import actions
// ===========================================================================
import { editAlert, deleteAlert, createAlert, sortAlerts } from './actions';

// Import Child components
// ===========================================================================
import makePageContainer from 'common/hocs/container';
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/list';
import EditAlert from './components/edit';

class Alerts extends React.Component {
  render() {
    const { listText, state, payload, createItem, deleteConfirm, editItem, editText, actionSort, chosen, deleting, route, curId } = this.props;
    return (
      <div className='mod-page'>
        <ListSection
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
              deleteText='Delete this alert'
            />
          )}
        </ListSection>
        {(chosen) ? (
          <EditAlert
            data={chosen}
            state={state}
            onSubmit={editItem}
            backUrl={route.path}
            texts={editText}
          />
        ) : null}
        {(deleting) ? (
          <DeleteConfirmation close={deleteConfirm()} accept={deleteConfirm(deleting.id)}>
            <dl>
              <dt>Are you sure you want to delete the alert</dt>
              <dd>{`ID: ${deleting.id} - ${deleting.name}.`}</dd>
            </dl>
          </DeleteConfirmation>
        ) : null}
      </div>
    );
  }
}

Alerts.defaultProps = {
  listText: {
    title: 'Alerts Management',
    description: 'Create, edit and delete alerts that will be sent to you when specific columns get new items.',
    btn: 'Create new alert',
    placeholder: 'Enter name',
    deleting: 'Are you sure want to delete this Alert?',
    empty: 'No alerts created yet. Use form above to create one.'
  },
  editText: {
    title: 'Edit alert',
    description: 'Pick the columns to send. Set time to send, e-mail recipient and alert name here.',
    confirmation: '{data} were changed. Save changes?'
  }
};

Alerts.propTypes = {
  curId: PropTypes.number.isRequired,
  deleting: PropTypes.shape(listShape),
  listText: PropTypes.objectOf(PropTypes.string).isRequired,
  editText: PropTypes.objectOf(PropTypes.string).isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(listShape)).isRequired,
  state: stateNum.isRequired,
  editItem: PropTypes.func.isRequired,
  deleteConfirm: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  actionSort: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  chosen: PropTypes.shape(coreInterface)
};

// Connect our Container to State
// @ deps -> Alerts
// ===========================================================================
export default connect(makeContainerSelector, {
  actionSort: sortAlerts,
  actionCreate: createAlert,
  actionEdit: editAlert,
  actionDelete: deleteAlert
})(makePageContainer({ create: 'edit' }, Alerts));
