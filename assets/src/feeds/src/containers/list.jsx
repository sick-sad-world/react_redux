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
import Icon from 'common/components/icon';
import Feed from '../components/feed';

class FeedsList extends React.Component {

  renderButton(id) {
    const { action } = this.props;
    return (action) ? (<a title={action.title} onClick={action.handler(id)}><Icon icon={action.name}/></a>) : null;
  }

  renderFeeds() {
    return this.props.payload.map(feed => (
      <Feed key={feed.id} {...feed} sortable={false}>
        {(feed.uniq) ? (
          <a onClick={null} title='Delete this source'><Icon icon='trash' /></a>
        ) : this.renderButton(feed.id)}
      </Feed>
    ));
  }

  render() {
    return (
      <ul className={this.props.className}>
        { (!this.props.payload.length) ? <li className='state-empty'>{this.props.emptyTpl}</li> : this.renderFeeds() }
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
  action: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired
  }),
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
    deleteFeed(id) {
      return dispatch(deleteFeed({ id }));
    }
  };
}

export default connect(mapStateToProps(), mapDispatchToProps)(FeedsList);
