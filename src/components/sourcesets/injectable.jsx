// Import React related stuff
// ===========================================================================
import React from 'React';
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
    bindAll(this, ['updateState', 'makeSourceComponent', 'expandHandler']);
  }
  
  updateState (e) {
    this.setState({
      [e.target.name]: e.target.value || ''
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

  makeSourceComponent(source, disabled) {

    let button = <a href='' onClick={(e) => {
      e.preventDefault();
      this.props.selectHandler('source', source.id);
    }} title='Add this source to selection'><Icon icon='reply'/></a>;

    return <Source key={source.id} button={button} disabled={disabled} {...source} />;
  }

  render () {
    let search;
    let { sources, sets, omit, selectHandler } = this.props;
    // Define empty template
    // ===========================================================================
    let list = <li className='state-empty'>No sets or sources created yet. Make some before you can assign. </li>;

    // Build up resulting list
    // ===========================================================================
    if (sets.length) {
      if (this.state.search.length < 3) {
        // Display default list where sources grouped by sets
        // ===========================================================================
        list = sets.map((set) => {
          let expanded = this.state.expanded === set.id;
          return (!includes(omit.set, set.id)) ? (
            <Sourceset key={set.id} expanded={expanded} {...set} selectHandler={selectHandler} expandHandler={this.expandHandler}>
            {(expanded) ? sources.map((source) => {
              if (includes(set.source_ids, source.id)) {
                return this.makeSourceComponent(source, includes(omit.sources, source.id));
              } else {
                return null;
              }
            }) : null}
            </Sourceset>
          ) : null;
        });
      } else {
        search = new RegExp(this.state.search, 'i');
        // Display filtered sources by search parameter
        // ===========================================================================
        list = sources.map((source) => {
          if (search.test(source.name)) {
            return this.makeSourceComponent(source, includes(omit.sources, source.id));
          } else {
            return null;
          }
        });
      }
    }

    return (
      <div className='list'>
        <div className='header'>
          <input type='text' name='search' defaultValue={this.state.search} onChange={this.updateState} placeholder='Search for...' />
        </div>
        <ul className='entity-list'>
          {list}
        </ul>
      </div>
    );
  }
}