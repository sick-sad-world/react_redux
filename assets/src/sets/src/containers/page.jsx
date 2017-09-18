// Import utility stuff
// ===========================================================================
import { union, bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { listShape, stateNum } from 'common/typecheck';
import { coreInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import actions
// ===========================================================================
import { createSet, editSet, deleteSet, forseUpdateUniq, sortSets } from '../actions';

// Import Child components
// ===========================================================================
import ContainerAlt from 'common/hocs/container';
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/list';
import EditSet from '../components/edit';
import { FeedCreate } from 'src/feeds';

class Sourcesets extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, 'updateOnNewFeeds');
  }

  updateOnNewFeeds(data) {
    const { editItem, changeLocation, chosen, route } = this.props;
    return editItem({
      id: chosen.id,
      source_ids: union(chosen.source_ids, data)
    }).then(() => changeLocation(`${route.path}/${chosen.id}`));
  }

  renderDetails() {
    const { state, editItem, editText, chosen, route, curId, params, payload } = this.props;
    if (params.create) {
      return (
        <FeedCreate
          set={{ id: chosen.id, name: chosen.name }}
          onCreate={this.updateOnNewFeeds}
          backPath={route.path}
        />
      );
    }
    return (
      <EditSet
        data={chosen}
        state={state}
        current={curId}
        update={editItem}
        backPath={route.path}
        className='mod-sourceset-edit'
        formProps={{
          sets: payload.filter(({ id }) => id !== curId),
          path: `${route.path}/${curId}`,
          texts: editText
        }}
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
              deleteText='Delete this sourceset'
            />
          )}
        </ListSection>
        {(chosen) ? this.renderDetails() : null}
        {(deleting) ? (
          <DeleteConfirmation close={deleteConfirm()} accept={deleteConfirm(deleting.id)}>
            <dl>
              <dt>Trendolizer sourceset</dt>
              <dd>
                <p>{`ID: ${deleting.id} - ${deleting.name}. Containing: ${deleting.source_ids.length} sources`}</p>
              </dd>
            </dl>
          </DeleteConfirmation>
        ) : null}
      </div>
    );
  }
}

// Sourcesets container default props
// ===========================================================================
Sourcesets.defaultProps = {
  listText: {
    title: 'Sources Management',
    description: 'Create, edit and delete sets of sources. Drag to reorder list. Open set to edit the sources in it.',
    btn: 'Create new sourceset',
    placeholder: 'Enter name',
    deleting: 'Are you sure want to delete this Sourceset?',
    empty: 'No sourcesets created yet. Use form above to create one.'
  },
  editText: {
    title: 'Edit form',
    description: 'Simple edit form to manipulate entity props',
    confirmation: '{data} were changed. Save changes?'
  }
};

// Prop type check
// ===========================================================================
Sourcesets.propTypes = {
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
  changeLocation: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  chosen: PropTypes.shape(coreInterface)
};

// Connect our Container to State
// @ deps -> Sourcesets
// ===========================================================================
function mapDispatchToProps(dispatch) {
  return {
    actionSort(data, opts) {
      return dispatch(sortSets(data, opts));
    },
    actionCreate(data, opts) {
      return dispatch(createSet(data, opts));
    },
    actionEdit(data, changed, opts) {
      return dispatch(editSet(data, changed, opts)).then(() => dispatch(forseUpdateUniq));
    },
    actionDelete(data) {
      return dispatch(deleteSet(data)).then(() => dispatch(forseUpdateUniq));
    }
  };
}

export default connect(makeContainerSelector, mapDispatchToProps)(ContainerAlt({ create: 'call' }, Sourcesets));
