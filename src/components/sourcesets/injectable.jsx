// Import React related stuff
// ===========================================================================
import classNames from 'classnames';
import React from 'react';
import { includes, bindAll } from 'lodash';

// Import child components
// ===========================================================================
import Select from 'react-select';
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
    bindAll(this, ['updateSearch', 'makeSourceComponent', 'expandHandler']);
  }
  
  updateSearch (e) {
    this.setState({
      search: e.target.value || ''
    });
  }

  expandHandler (id) {
    this.setState({expanded: id});
  }

  shouldComponentUpdate (newProps, newState) {
    let validSearch = newState.search.length >= 3;
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
        <a key='sel' onClick={() => this.props.selectHandler('set', set.id)} title='Add this set to selection'><Icon icon='reply-all' /></a>,
        <a key='show' onClick={() => this.expandHandler((expanded) ? 0 : set.id)} title='View contents'><Icon icon={(expanded) ? 'chevron-up' : 'chevron-down'} /></a>
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
    let data = Object.assign({
      key: source.id,
      disabled,
      button: (<a onClick={() => this.props.selectHandler('source', source.id)} title='Add this source to selection'><Icon icon='reply'/></a>)
    }, source)

    return <Source {...data} />;
  }

  render () {
    let search;
    let { sources, sets, disable, disabled } = this.props;
    // Define empty template
    // ===========================================================================
    let list = <li className='state-empty'>No sets or sources created yet. Make some before you can assign. </li>;

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
          <input type='text' name='search' defaultValue={this.state.search} onChange={this.updateSearch} placeholder='Search for...' />
        </div>
        <ul className='entity-list'>
          {list}
        </ul>
      </div>
    );
  }
}