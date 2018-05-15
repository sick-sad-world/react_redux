// Import utility stuff
// ===========================================================================
import union from 'lodash/union';
import bindAll from 'lodash/bindAll';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { listShape } from 'common/typecheck';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import actions
// ===========================================================================
import { createSet, editSet, deleteSet, addFeed, removeFeed, sortSets } from '../actions';

// Import Child components
// ===========================================================================
import makePageContainer, { injectedProps } from 'common/hocs/container';
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/list';
import EditSet from '../components/edit';
import { FeedCreate } from 'src/feeds';

class SetsPage extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, 'updateOnNewFeeds');
  }

  updateOnNewFeeds(data) {
    const { editItem, changeLocation, chosen } = this.props;
    return editItem({
      id: chosen.id,
      source_ids: union(chosen.source_ids, data)
    }).then(() => changeLocation(`/${chosen.id}`));
  }

  renderDetails() {
    const { loading, editText, chosen, route, curId, params } = this.props;
    if (params.create) {
      return (
        <FeedCreate
          set={{ id: chosen.id, name: chosen.name }}
          onCreate={this.updateOnNewFeeds}
          backPath={`${route.path}/${curId}`}
        />
      );
    }
    return (
      <EditSet
        data={chosen}
        loading={loading === 'editing'}
        addFeed={this.props.addFeed}
        removeFeed={this.props.removeFeed}
        onSubmit={this.props.editItem}
        backUrl={route.path}
        texts={editText}
      />
    );
  }

  render() {
    const { listText, payload, loading, chosen, deleting, route, curId } = this.props;
    return (
      <div className='mod-page'>
        <ListSection
          loading={loading === 'creating'}
          payload={payload}
          createItem={this.props.createItem}
          deleteItem={this.props.deleteConfirm}
          sortItems={this.props.actionSort}
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
          <DeleteConfirmation close={this.props.deleteConfirm()} loading={loading === 'deleting'} accept={this.props.deleteItem}>
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
SetsPage.defaultProps = {
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
SetsPage.propTypes = {
  curId: PropTypes.number.isRequired,
  listText: PropTypes.objectOf(PropTypes.string).isRequired,
  editText: PropTypes.objectOf(PropTypes.string).isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(listShape)).isRequired,
  router: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  chosen: PropTypes.shape(defaultInterface),
  ...injectedProps
};

export default connect(makeContainerSelector, {
  actionSort: sortSets,
  actionCreate: createSet,
  addFeed,
  removeFeed,
  actionEdit: editSet,
  actionDelete: deleteSet
})(makePageContainer({ create: 'call' }, SetsPage));
