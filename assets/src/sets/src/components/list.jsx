// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';

// Import Child components
// ===========================================================================
import Sourceset from './sourceset';
import { FeedsList } from 'src/feeds';

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
      <div className={classNames(...this.props.className.split(' '), {
        'state-disabled': this.props.disabled
      })}>
        <div className='header'>
          <input type='text' name='search' value={this.state.search} onChange={this.updateSearch} placeholder='Search for...' />
        </div>
          {(this.state.search > this.props.treshold) ? (
            <FeedsList className='entity-list' criterea={{ search: this.state.search }} action={this.props.onFeedClick} />
          ) : (
            <ul className='entity-list'>
              {this.props.data.map(set => (
                <Sourceset
                  key={set.id}
                  name={set.name}
                  counter={set.source_ids.length}
                  sortable={false}
                  onExpand={this.updateExpanded(set.id)}
                  select={this.props.onSetClick(set.id)}
                >
                  {(this.state.expanded === set.id) ? (
                    <FeedsList
                      disabled={this.props.dis_sources}
                      criterea={{ source_ids: set.source_ids }}
                      select={this.props.onFeedClick}
                      empty='This set does not contain any feeds. Add some.'
                    />
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
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  treshold: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  onSetClick: PropTypes.func.isRequired,
  onFeedClick: PropTypes.func.isRequired
};
