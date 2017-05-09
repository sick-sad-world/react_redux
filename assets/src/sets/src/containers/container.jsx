// Import utility stuff
// ===========================================================================
import { bindAll, union } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import actions
// ===========================================================================
import { createSet, editSet, deleteSet, forseUpdateUniq } from '../actions';

// Import Child components
// ===========================================================================
import Container from 'common/components/container';
import EditSet from '../components/edit';
import { FeedCreate } from 'src/feeds';

class Sourcesets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: null
    };
    bindAll(this, 'confText', 'updateOnNewFeeds', 'renderChildren');
  }

  updateOnNewFeeds(data) {
    return this.props.actionEdit({
      id: this.props.chosen.id,
      source_ids: union(this.props.chosen.source_ids, data)
    }).then(() => this.props.router.push(`${this.props.route.path}/${this.props.chosen.id}`));
  }

  confText(deleting) {
    return (
      <dl>
        <dt>Trendolizer sourceset</dt>
        <dd>
          <p>{`ID: ${deleting.id} - ${deleting.name}. Containing: ${deleting.source_ids.length} sources`}</p>
        </dd>
      </dl>
    );
  }

  renderChildren(props) {
    const { chosen, params, payload, curId } = this.props;
    if (chosen) {
      if (params.create) {
        return (
          <FeedCreate set={{ id: chosen.id, name: chosen.name }} onCreate={this.updateOnNewFeeds} backPath={this.props.route.path} />
        );
      }
      return <EditSet {...props} className='mod-sourceset-edit' formProps={{
        sets: payload.filter(({ id }) => id !== curId),
        path: `${this.props.route.path}/${curId}`
      }} />;
    }
    return null;
  }

  render() {
    return (
      <Container {...this.props} confText={this.confText}>
        {this.renderChildren}
      </Container>
    );
  }
}

// Sourcesets container default props
// ===========================================================================
Sourcesets.defaultProps = {
  listItemOpts: {
    deleteText: 'Delete this sourceset'
  },
  listSectionOpts: {
    sortable: false,
    texts: {
      title: 'Sources Management',
      description: 'Create, edit and delete sets of sources. Drag to reorder list. Open set to edit the sources in it.',
      btn: 'Create new sourceset',
      placeholder: 'Enter name',
      deleting: 'Are you sure want to delete this Sourceset?',
      empty: 'No sourcesets created yet. Use form above to create one.'
    }
  },
  editOpts: {
    texts: {
      title: 'Edit form',
      description: 'Simple edit form to manipulate entity props',
      confirmation: '{data} was changed. Save changes?'
    }
  }
};

// Prop type check
// ===========================================================================
Sourcesets.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  curId: PropTypes.number,
  chosen: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  params: PropTypes.object.isRequired,
  forseUpdateUniq: PropTypes.func.isRequired,
  actionCreate: PropTypes.func.isRequired,
  actionEdit: PropTypes.func.isRequired,
  actionDelete: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Sourcesets
// ===========================================================================
function mapStateToProps() {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actionCreate(...args) {
      return dispatch(createSet(...args));
    },
    actionEdit(...args) {
      return dispatch(editSet(...args));
    },
    forseUpdateUniq(...args) {
      return dispatch(forseUpdateUniq(...args));
    },
    actionDelete(data) {
      return dispatch(data).then(this.props.forseUpdateUniq);
    }
  };
}

export default connect(mapStateToProps(), mapDispatchToProps)(Sourcesets);
