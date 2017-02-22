// Import utility stuff
// ===========================================================================
import {} from 'lodash';
import { defColumnParameters } from '../redux/columns';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import Select from 'react-select';
import Icon from './icon';
import Toggler from './toggler';

// Main app screen - Dashboard
// ===========================================================================
export default class Column extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  // Make toggler handler for simple state prop true/false
  // ===========================================================================
  expandedStateToggler() {
    this.setState({ expanded: !this.state.expanded });
  }

  scrollHandler (e) {
    if (!this.infinite && e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight - 100) {
      let item = this.props.item;
      this.infinite = true;
      this.actions
          .getResults({...item.data, offset: this.props.data.length}, {id: item.id, state: false})
          .catch(this.actions.throwError)
          .then(() => {this.infinite = false});
    }
  }

  render() {
    let running = this.props.state > 3;
    let open = this.props.open;
    let visIconData = this.props.visIconData;
    return (
      <section className='mod-column'>
        <header className='column-header'>
          <Icon className='drag-handle' icon='dots-three-vertical' />
          <h1 className='funName'>{ this.props.name }</h1>
          <nav className='nav-links'>
            <a title='Refresh column' onClick={this.refreshResults}><Icon icon='cw' /></a>
            <a onClick={this.expandedStateToggler} title='Column settings'><Icon icon='cog' /></a>
          </nav>
        </header>
        <form className='column-settings'>
          <div className='row-flex'>
            <Select
              disabled={running || this.state.sort_prop === 'found'}
              className='size-120'
              name='sort_pref'
              placeholder='Prefix...'
              options={this.props.sortPrefix}
              onChange={this.makeSelectHandler && this.makeSelectHandler('sort_pref')}
              autosize={false}
              clearable={true}
              searchable={false}
              value={this.state.sort_pref}
            />
            <Select
              disabled={running}
              className='size-180'
              name='sort_prop'
              options={this.props.sortProperty}
              onChange={this.makeSelectHandler && this.makeSelectHandler('sort_prop')}
              autosize={false}
              clearable={false}
              searchable={false}
              value={this.state.sort_prop}
            />
            <span className={`switcher-direction${(running) ? ' is-disabled' : ''}`}>
              <input
                type='checkbox'
                disabled={running}
                name='direction'
                onChange={this.updateValue}
                checked={this.state.direction === 'desc'}
                value={(this.state.direction === 'desc') ? 'asc' : 'desc'}
              />
              <Icon icon='bar-graph' />
            </span>
          </div>
          <div className='row-flex'>
            <span className='form-label'>Infinite scroll</span>
            <Toggler
              disabled={running}
              name='infinite'
              options={{
                'Yes': 1,
                'No': 0
              }}
              onChange={this.updateValue}
              value={this.state.infinite} />
          </div>
          <div className='row-flex'>
            <span className='form-label'>Autoreloading</span>
            <Toggler
              disabled={running}
              name='autoreload'
              options={{
                'On': this.state.infinite || 30,
                'Off': 0
              }}
              onChange={this.updateValue}
              value={this.state.autoreload} />
          </div>
          <div className='column-subnav'>
            <a onClick={this.hideColumn} title={visIconData[open].title}><Icon icon={visIconData[open].icon} />Hide</a>
            <Link to={`columns/${this.props.id}`}  title='Column setting screen'><Icon icon='cog' />Settings</Link>
            {/*<a onClick={this.makeDeletingStateToggler(this.props.id)} title='Delete this column'><Icon icon='trash' />Delete</a>*/}
          </div>
        </form>
        <ul className='entity-list' onScroll={(this.props.infinite) ? (e) => this.debouncedScrollHandler(e.persist()) : null}>
          {this.props.children}
        </ul>
      </section>
    );
  }
}

Column.defaultProps = {
  statePending: 'Wait a second results are in quene...',
  stateLoading: 'Content is being loaded, please stand by...',
  stateEmpty: 'It seems we could not find any items matching your query at this time. <br />Try again later or modify the filter settings for this column.',
  stateError: 'It seems there was a problem with the server.',
  tableRange: [0.3, 0.5, 0.75, 0.99999],
  tableTexts: [
    'These story is not "hot" anymore',
    'A bit hot, but past it prime',
    'This is "hot" story',
    'This is very "hot" story',
    'Be careful this is "new" story and result may be different'
  ],
  tableStats: ['tweets', 'likes', 'shares', 'pins', 'comments', 'votes_video', 'views_video', 'comments_video'],
  sortPrefix: defColumnParameters.sortPrefix,
  sortProperty: defColumnParameters.sortProperty,
  visIconData: [{icon: 'eye', title: 'Show this column'}, {icon: 'eye-with-line', title: 'Hide this column'}]
}