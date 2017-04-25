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
    const feedAction = {
      name: 'select',
      title: 'Add this source to selection',
      handler: this.props.onClick('source')
    };

    return (
      <div className={classNames(...this.props.className.split(' '), {
        'state-disabled': this.props.disabled
      })}>
        <div className='header'>
          <input type='text' name='search' value={this.state.search} onChange={this.updateSearch} placeholder='Search for...' />
        </div>
          {(this.state.search > this.props.treshold) ? (
            <FeedsList
              className='entity-list'
              criterea={{ search: this.state.search }}
              action={feedAction}
            />
          ) : (
            <ul className='entity-list'>
              {this.props.data.map(set => (
                <Sourceset
                  key={set.id}
                  name={set.name}
                  counter={set.source_ids.length}
                  sortable={false}
                  onExpand={this.updateExpanded(set.id)}
                  action={{
                    name: 'select-all',
                    title: 'Add this set contents to selection',
                    handler: this.props.onClick('set')(set.id),
                    ...this.props.setAction
                  }}
                >
                  {(this.state.expanded === set.id) ? (
                    <FeedsList
                      criterea={{ source_ids: set.source_ids }}
                      action={feedAction}
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
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  treshold: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  onClick: PropTypes.func.isRequired
};
