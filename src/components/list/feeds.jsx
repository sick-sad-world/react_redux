// Import React related stuff
// ===========================================================================
import classNames from 'classnames';
import React from 'react';
import { includes, bindAll } from 'lodash';

// Import child components
// ===========================================================================
import Icon from '../icon';
import Sourceset from './sourceset';
import Source from './source';

export default class FeedsList extends React.Component {
  constructor(props) {
    // Preform required stuff
    // ===========================================================================
    super(props);
    this.state = {
      search: '',
      expanded: 0
    }

    // Bind handlers
    // ===========================================================================
    bindAll(this, 'makeSourceComponent', 'expandHandler');
  }

  expandHandler (id) {
    this.setState({expanded: id});
  }

  shouldComponentUpdate (newProps, newState) {
    let validSearch = newState.search.length >= this.props.search;
    let searchCanceled = (this.state.search.length && !newState.search.length);
    let expandedChanged = this.state.expanded !== newState.expanded
    return newProps || validSearch || searchCanceled || expandedChanged;
  }

  makeSetComponent(set, disabled) {
    let expanded = this.state.expanded === set.id;
    let data = Object.assign({
      key: set.id,
      expanded,
      disabled,
      buttons: [
        <a key='sel' onClick={() => this.props.action('set', set.id)} title='Add this set to selection'><Icon icon='reply-all' /></a>,
        <a key='show' onClick={() => this.setState({expanded: (expanded) ? 0 : set.id})} title='View contents'><Icon icon={(expanded) ? 'chevron-up' : 'chevron-down'} /></a>
      ]
    }, set);

    return (
      <Sourceset {...data}>
        {(expanded) ? this.props.sources.map((source) => {
          if (includes(set.source_ids, source.id)) {
            return this.makeSourceComponent(source, includes(this.props.disable.source, source.id));
          } else {
            return null;
          }
        }) : null}
      </Sourceset>
    );
  }

  makeSourceComponent(source, disabled) {
    let btn = <a onClick={() => this.props.action('source', source.id)} title='Add this source to selection'><Icon icon='reply'/></a>;
    return <Source key={source.id} disabled={disabled} button={btn} {...source} />;
  }

  render () {
    let search;
    let { sources, sets, disable, disabled } = this.props;
    // Define empty template
    // ===========================================================================
    let list = this.props.emptyTpl;

    let rootClass = classNames({
      'list': true,
      'state-disabled': disabled
    });
    
    // Build up resulting list
    // ===========================================================================
    if (sets.length) {
      if (this.state.search.length < 3) {
        // Display default list where sources grouped by sets
        // ===========================================================================
        list = sets.map((set) => this.makeSetComponent(set, includes(disable.set, set.id)));
      } else {
        search = new RegExp(this.state.search, 'i');
        // Display filtered sources by search parameter
        // ===========================================================================
        list = sources.map((source) => (search.test(source.name)) ? this.makeSourceComponent(source, includes(disable.source, source.id)) : null);
      }
    }

    return (
      <div className={rootClass}>
        <div className='header'>
          {(this.props.search > 0) ? (
            <input type='text' name='search' defaultValue={this.state.search} onChange={(e) => this.setState({ search: e.target.value || '' })} placeholder='Search for...' />
          ) : null }
        </div>
        <ul className='entity-list'>
          {list}
        </ul>
      </div>
    );
  }
}

FeedsList.defaultProps = {
  search: 3,
  emptyTpl: <li className='state-empty'>No sets or sources created yet. Make some before so you will have to choose from. </li>
}