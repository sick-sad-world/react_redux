// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { includes, bindAll } from 'lodash';

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
import { deleteFeed } from '../actions';


// Import child components
// ===========================================================================
import DeleteConfirmation from 'common/components/delete-confirmation';
import { Delete, Select, Deselect } from 'common/components/buttons';
import Feed from '../components/feed';

class FeedsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deleting: null
    };
    bindAll(this, 'renderFeed', 'deletingReset');
  }

  setDeleting(feed) {
    return () => this.setState({ deleting: feed });
  }

  deletingReset() {
    this.setState({ deleting: null });
  }

  deleteFeed(id) {
    return () => this.props.deleteFeed({ id, set_id: this.props.set_id }).then(this.deletingReset);
  }

  renderFeed(feed) {
    let Button = null;
    if (feed.deletable && this.props.set_id) {
      Button = <Delete handler={this.setDeleting(feed)} />;
    } else if (this.props.select) {
      Button = <Select handler={this.props.select(feed.id)} />;
    } else if (this.props.deselect) {
      Button = <Deselect handler={this.props.deselect(feed.id)} />;
    }
    return (
      <Feed key={feed.id} {...feed} disabled={this.props.disabled && includes(this.props.disabled, feed.id)} sortable={false}>{Button}</Feed>
    );
  }

  render() {
    return (
      <ul className={this.props.className}>
        {(this.props.payload.length) ? this.props.payload.map(this.renderFeed) : <li className='state-empty'>{this.props.emptyTpl}</li>}
        {(this.state.deleting) ? (
          <DeleteConfirmation close={this.deletingReset} accept={this.deleteFeed(this.state.deleting.id)} >
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
  select: null,
  deselect: null
};


FeedsList.propTypes = {
  criterea: PropTypes.shape({
    source_ids: PropTypes.arrayOf(PropTypes.number),
    uniq_ids: PropTypes.arrayOf(PropTypes.number),
    seach: PropTypes.string
  }),
  disabled: PropTypes.arrayOf(PropTypes.number),
  set_id: PropTypes.number,
  children: PropTypes.element,
  select: PropTypes.func,
  deselect: PropTypes.func,
  className: PropTypes.string,
  state: stateNum.isRequired,
  emptyTpl: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  deleteFeed: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Feeds
// ===========================================================================
function mapStateToProps() {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    deleteFeed(data) {
      return dispatch(deleteFeed(data));
    }
  };
}

export default connect(mapStateToProps(), mapDispatchToProps)(FeedsList);
