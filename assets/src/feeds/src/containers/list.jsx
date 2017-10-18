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
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import actions
// ===========================================================================
import { deleteFeed } from '../actions';


// Import child components
// ===========================================================================
import DeleteConfirmation from 'common/components/delete-confirmation';
import { Delete } from 'common/components/buttons';
import Feed from '../components/feed';

class FeedsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      deleting: null
    };
    bindAll(this, 'renderActions', 'deletingReset');
  }

  setDeleting(feed) {
    return () => this.setState({ deleting: feed });
  }

  deletingReset() {
    this.setState({ deleting: null, loading: false });
  }

  deleteFeed(id) {
    return () => {
      this.setState({ loading: true });
      this.props.deleteFeed({ id, set_id: this.props.set_id }).catch(console.error).then(this.deletingReset);
    };
  }

  renderActions(feed) {
    if (this.props.deletable && feed.deletable && this.props.set_id) {
      return <Delete onClick={this.setDeleting(feed)} />;
    } else if (this.props.children) {
      return this.props.children(feed);
    }
    return null;
  }

  render() {
    const { payload, sortable } = this.props;
    return (
      <ul className={this.props.className}>
        {(payload.length) ? payload.map(feed => (
          <Feed key={feed.id} {...feed} sortable={sortable}>{this.renderActions(feed)}</Feed>
        )) : <li className='state-empty'>{this.props.emptyTpl}</li>}
        {(this.state.deleting) ? (
          <DeleteConfirmation loading={this.state.loading} close={this.deletingReset} accept={this.deleteFeed(this.state.deleting.id)} >
            <dl>
              <dt>Trendolizer Feed</dt>
              <dd>{`ID: ${this.state.deleting.id} - ${this.state.deleting.name}`}</dd>
            </dl>
          </DeleteConfirmation>
        ) : null}
      </ul>
    );
  }

}

FeedsList.defaultProps = {
  className: 'entity-list',
  emptyTpl: 'No feeds found.',
  deletable: true,
  sortable: false
};


FeedsList.propTypes = {
  criterea: PropTypes.shape({
    source_ids: PropTypes.arrayOf(PropTypes.number),
    uniq_ids: PropTypes.arrayOf(PropTypes.number),
    disabled: PropTypes.arrayOf(PropTypes.number),
    seach: PropTypes.string
  }),
  set_id: PropTypes.number,
  deletable: PropTypes.bool.isRequired,
  sortable: PropTypes.bool.isRequired,
  children: PropTypes.func,
  className: PropTypes.string,
  emptyTpl: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  deleteFeed: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Feeds
// ===========================================================================
export default connect(makeContainerSelector, { deleteFeed })(FeedsList);
