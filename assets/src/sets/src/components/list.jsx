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
import { Select } from 'common/components/buttons';
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
              <Select handler={this.props.onFeedClick} />
            </FeedsList>
          ) : (
            <ul className='entity-list'>
              {this.props.data.map(set => (
                <Sourceset
                  key={set.id}
                  name={set.name}
                  counter={set.source_ids.length}
                  sortable={false}
                  disabled={this.props.dis_sets && includes(this.props.dis_sets, set.id)}
                  onExpand={this.updateExpanded(set.id)}
                  select={this.props.onSetClick(set.id)}
                >
                  {(this.state.expanded === set.id) ? (
                    <FeedsList criterea={{ source_ids: set.source_ids, disabled: this.props.dis_sources }} empty='This set does not contain any feeds. Add some.'>
                      <Select handler={this.props.onFeedClick} />
                    </FeedsList>
                  ) : null}
                </Sourceset>
              ))}
            </ul>
          )}
      </div>
    );
  }
}

SetsWithContents.defaultProps = {
  className: 'list',
  treshold: 3,
  disabled: false
};

SetsWithContents.propTypes = {
  dis_sources: PropTypes.arrayOf(PropTypes.number),
  dis_sets: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  treshold: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  onSetClick: PropTypes.func.isRequired,
  onFeedClick: PropTypes.func.isRequired
};
