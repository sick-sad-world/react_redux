// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { bindAll, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';

// Import Child components
// ===========================================================================
import { Expand, Collapse } from 'common/components/buttons';
import { FeedsList } from 'src/feeds';
import Sourceset from './sourceset';

export default class SetsWithContents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      expanded: null
    };

    bindAll(this, 'updateSearch', 'updateExpanded');
  }

  updateExpanded(id) {
    return () => this.setState({ expanded: (this.state.expanded === id) ? null : id });
  }

  updateSearch(e) {
    this.setState({ search: e.target.value || '' });
  }

  renderSourceset({ id, name, source_ids, disabled, ...set }, isOpened) {
    const onExpand = this.updateExpanded(id);
    return (
      <Sourceset key={id} name={name} counter={source_ids.length} sortable={this.props.sortable} disabled={disabled} >
        {(this.props.setAction) ? this.props.setAction({ id, name, source_ids, disabled, ...set, isOpened }) : null}
        {(isOpened) ? <Collapse handler={onExpand} /> : <Expand handler={onExpand} /> }
      </Sourceset>
    );
  }

  renderSetFeeds(source_ids) {
    return (
      <li key='list' className='sublist'>
        <FeedsList criterea={{ source_ids, disabled: this.props.disabled_sources }} empty={this.props.feedsEmpty} >
          {this.props.feedAction}
        </FeedsList>
      </li>
    );
  }

  render() {
    return (
      <div className={classNames(this.props.className, {
        'state-disabled': this.props.disabled
      })}>
        <div className='header'>
          <input type='text' name='search' value={this.state.search} onChange={this.updateSearch} placeholder='Search for...' />
        </div>
          {(this.state.search.length > this.props.treshold) ? (
            <FeedsList className='entity-list' criterea={{ search: this.state.search }}>
              {this.props.feedAction}
            </FeedsList>
          ) : (
            <ul className='entity-list'>
              {this.props.payload.reduce((acc, set) => {
                const isOpened = this.state.expanded === set.id;
                acc.push(this.renderSourceset(set, isOpened));
                if (isOpened) {
                  acc.push(this.renderSetFeeds(set.source_ids));
                }
                return acc;
              }, [])}
            </ul>
          )}
      </div>
    );
  }
}

SetsWithContents.defaultProps = {
  className: 'list',
  treshold: 3,
  disabled: false,
  sortable: false,
  feedsEmpty: 'This set does not contain any feeds. Add some.'
};

SetsWithContents.propTypes = {
  disabled_sources: PropTypes.arrayOf(PropTypes.number),
  disabled_sets: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
  sortable: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  treshold: PropTypes.number.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  setAction: PropTypes.func,
  feedAction: PropTypes.func,
  feedsEmpty: PropTypes.string.isRequired
};
