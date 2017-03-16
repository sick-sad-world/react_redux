// Import utility stuff
// ===========================================================================
import { bindAll, debounce, pick } from 'lodash';
import { inject } from '../helpers/functions';
import deletable from '../helpers/deletable';
import { numOrString } from '../helpers/functions';
import { defColumnParameters, decomposeColumnSort, composeColumnSort } from '../redux/columns';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Import Child components
// ===========================================================================
import { Link } from 'react-router';
import Icon from './icon';
import Sorting from './forms/sorting';
import Toggler from './forms/toggler';
import Results from '../containers/results';

// Main app screen - Dashboard
// ===========================================================================
export default class Column extends React.Component {
  constructor (props) {
    super(props);
    inject(this, deletable);
    this.interval = null;
    this.state = this.mapDataToState(props);
    bindAll(this, 'expandedStateToggler', 'hideColumn', 'scrollHandler');
    //console.log('Dashboard mount');
    this.debouncedScrollHandler = debounce(this.scrollHandler, 250);
  }

  componentWillReceiveProps (newProps) {
    this.setState(this.mapDataToState(newProps));
  } 

  mapDataToState(data) {
    let expanded = this.state && this.state.expanded || false;
    let curAutoreload = (this.state) ? this.state.autoreload : 0;
    if (expanded && window.location.pathname !== '/') {
      expanded = false;
    }

    if (data.autoreload > 0) {
      if (data.autoreload !== curAutoreload) {
        clearInterval(this.interval);
        this.interval = setInterval(this.props.onClick, data.autoreload * 1000);
      }
    } else if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    return {
      deleting: 0,
      expanded: expanded,
      ...pick(data, 'name', 'open', 'direction', 'infinite', 'autoreload', 'sort')
    }
  }

  expandedStateToggler() {
    this.setState({ expanded: !this.state.expanded });
  }

  updateValue(name) {
    return (e) => {
      let newState = undefined;
        if (name === 'sorting' && e.sort) {
          newState = e;
        } else if (e.target) {
          newState = {[name]: numOrString(e.target.value)};
        }
      if (newState === undefined) return;
      return this.setState(newState, () => {
        return this.props.onChange({id: this.props.id, data: pick(this.state, 'direction', 'infinite', 'autoreload', 'sort')});
      })
    }
  }

  scrollHandler (target, offset) {
    if (!this.infinite && target.scrollTop >= target.scrollHeight - target.clientHeight - 100) {
      this.infinite = true;
      this.props.onScroll(offset).then(() => {this.infinite = false});
    }
  }

  hideColumn(e) {
    return this.props.onChange({
      id: this.props.id,
      open: 0
    });
  }

  renderEditForm () {
    let running = this.props.state > 2;
    let open = this.props.open;
    let visIconData = this.props.visIconData;
    //console.log('Column render');
    return (
      <form className='column-settings'>
        <Sorting
          className='row-flex'
          value={this.state.sort}
          direction={this.state.direction}
          disabled={running}
          onChange={this.updateValue('sorting')}
        />
        <Toggler
          disabled={running}
          label='Infinite scroll'
          className='row-flex'
          name='infinite'
          options={{
            'Yes': 1,
            'No': 0
          }}
          onChange={this.updateValue('infinite')}
          value={this.state.infinite}
        />
        <Toggler
          disabled={running}
          label='Autoreloading'
          className='row-flex'
          name='autoreload'
          options={{
            'On': this.state.autoreload || 30,
            'Off': 0
          }}
          onChange={this.updateValue('autoreload')}
          value={this.state.autoreload}
        />
        <div className='column-subnav'>
          <a onClick={this.hideColumn} title={visIconData[open].title}><Icon icon={visIconData[open].icon} />Hide</a>
          <Link to={`/columns/${this.props.id}`} title='Column setting screen'>
            <Icon icon='cog' />Settings
          </Link>
          <a onClick={this.makeDeleteToggler(this.props.id)} title='Delete this column'><Icon icon='trash' />Delete</a>
        </div>
      </form>
    );
  }

  render() {
    return (
      <section className='mod-column'>
        <header className='column-header'>
          <Icon className='drag-handle' icon='dots-three-vertical' />
          <h1 className='funName'>{ this.props.name }</h1>
          <nav className='nav-links'>
            <a title='Refresh column' onClick={this.props.onClick}><Icon icon='cw' /></a>
            <a onClick={this.expandedStateToggler} title='Column settings'><Icon icon='cog' /></a>
          </nav>
        </header>
        {(this.state.expanded) ? this.renderEditForm() : null}
        {(this.state.deleting) ? this.renderDeleteDialog() : null}
        <Results
          id={this.props.id}
          sort={this.props.sort}
          display_settings={this.props.display_settings}
          onScroll={(this.props.infinite) ? this.debouncedScrollHandler : null}
        />
      </section>
    );
  }
}

Column.defaultProps = {
  visIconData: [{icon: 'eye', title: 'Show this column'}, {icon: 'eye-with-line', title: 'Hide this column'}]
}