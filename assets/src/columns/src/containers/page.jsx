// Import utility stuff
// ===========================================================================
import { bindAll, intersection } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { listShape, stateNum } from 'common/typecheck';
import { coreInterface, affectingProps } from '../defaults';
import { makePageSelector } from '../selectors';

// Import actions
// ===========================================================================
import { createColumn, editColumn, sortColumns, deleteColumn } from '../actions';
import { fetchResults, clearResults } from 'src/results';

// Import Child components
// ===========================================================================
import makePageContainer from 'common/hocs/container';
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/list';
import { Show, Hide } from 'common/components/buttons';
import EditColumn from '../components/edit';
import ColumnFeedsAssignment from '../components/assignment';

class Columns extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'makeItemIcon');
  }

  makeItemIcon({ id, open, order }) {
    return (open) ? (
      <Hide onClick={() => this.props.actionHide(id, order)} />
    ) : (
      <Show onClick={() => this.props.actionShow(id, order, this.props.payload.find(col => col.id === id).data)} />
    );
  }

  renderDetails() {
    const { state, editItem, editText, chosen, route, curId, params, assignmentText } = this.props;
    if (params.assignment) {
      return (
        <ColumnFeedsAssignment
          data={chosen}
          state={state}
          onSubmit={editItem}
          backUrl={`${route.path}/${curId}`}
          texts={assignmentText}
        />
      );
    }
    return (
      <EditColumn
        className='mod-column-edit'
        data={chosen}
        state={state}
        onSubmit={editItem}
        texts={editText}
        backUrl={route.path}
      />
    );
  }

  render() {
    const { listText, state, payload, createItem, deleteConfirm, actionSort, chosen, deleting, route, curId } = this.props;
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
              customIcon={this.makeItemIcon}
              deleteText='Delete this column'
            />
          )}
        </ListSection>
        {(chosen) ? this.renderDetails() : null}
        {(deleting) ? (
          <DeleteConfirmation close={deleteConfirm()} accept={deleteConfirm(deleting.id)}>
            <dl>
              <dt>Are you sure you want to delete the column</dt>
              <dd>{deleting.name}</dd>
            </dl>
          </DeleteConfirmation>
        ) : null}
      </div>
    );
  }
}

// Columns container default props
// ===========================================================================
Columns.defaultProps = {
  listText: {
    title: 'Columns Management',
    description: 'Create, edit or delete dashboard columns. Drag to reorder, use the eye icon to hide/unhide them (tip: hidden columns can still be used for alerts/reports).',
    btn: 'Create new column',
    placeholder: 'New column name',
    deleting: 'Are you sure want to delete this Column?',
    empty: 'No columns created yet. Use form above to create one.'
  },
  editText: {
    title: 'Edit column',
    description: 'Select the type of items to show in this column and how to display them.',
    confirmation: '{data} were changed. Save changes?'
  },
  assignmentText: {
    title: 'Assign feeds to column',
    description: 'Pick the sourcesets and sources this column to watch here.',
    confirmation: '{data} were changed. Save changes?'
  }
};

// Prop type check
// ===========================================================================
Columns.propTypes = {
  curId: PropTypes.number.isRequired,
  deleting: PropTypes.shape(listShape),
  listText: PropTypes.objectOf(PropTypes.string).isRequired,
  editText: PropTypes.objectOf(PropTypes.string).isRequired,
  assignmentText: PropTypes.objectOf(PropTypes.string).isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(listShape)).isRequired,
  state: stateNum.isRequired,
  editItem: PropTypes.func.isRequired,
  deleteConfirm: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  actionSort: PropTypes.func.isRequired,
  actionHide: PropTypes.func.isRequired,
  actionShow: PropTypes.func.isRequired,
  changeLocation: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  chosen: PropTypes.shape(coreInterface)
};

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
export default connect(makePageSelector, dispatch => ({
  actionSort(...args) {
    return dispatch(sortColumns(...args));
  },
  actionHide(id, order) {
    return dispatch(editColumn({ id, open: 0, order })).then(() => dispatch(clearResults(id)));
  },
  actionShow(id, order, data) {
    return dispatch(editColumn({ id, open: 1, order })).then((resp) => {
      if (fetchResults && data) {
        return dispatch(fetchResults(data, { entity: id }));
      }
      return resp;
    });
  },
  actionEdit(data, changed) {
    return dispatch(editColumn(data)).then((resp) => {
      if (fetchResults && data.open && intersection(affectingProps, changed).length) {
        return dispatch(fetchResults(data, { entity: data.id }));
      }
      return resp;
    });
  },
  actionCreate(...args) {
    return dispatch(createColumn(...args)).then((resp) => {
      if (fetchResults) {
        return dispatch(fetchResults(resp.payload.data, { entity: resp.payload.id }));
      }
      return resp;
    });
  },
  actionDelete({ id }) {
    return dispatch(deleteColumn({ id })).then((resp) => {
      if (clearResults) {
        return dispatch(clearResults(id));
      }
      return resp;
    });
  }
}))(makePageContainer({ create: 'call' }, Columns));
