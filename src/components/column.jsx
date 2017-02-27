// Import utility stuff
// ===========================================================================
import { bindAll, debounce } from 'lodash';
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
import Select from 'react-select';
import Icon from './icon';
import Toggler from './toggler';
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
      name: data.name,
      open: data.open,
      infinite: data.infinite,
      autoreload: data.autoreload,
      direction: data.direction,
      ...decomposeColumnSort(data.sort),
    }
  }

  expandedStateToggler() {
    this.setState({ expanded: !this.state.expanded });
  }

  updateValue(name) {
    return (e) => {
      let value = undefined;
        if (e === null) {
          value = e;
        } else if (e.target) {
          value = numOrString(e.target.value);
        } else if (e.value) {
          value = e.value;
        }
      return this.setState({[name]: value}, () => {
        return this.props.onChange({id: this.props.id, data: {
          direction: this.state.direction,
          infinite: this.state.infinite,
          autoreload: this.state.autoreload,
          sort: composeColumnSort(this.state.sort_pref, this.state.sort_prop)
        }});
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
    return (
      <form className='column-settings'>
        <div className='row-flex'>
          <Select
            disabled={running || this.state.sort_prop === 'found'}
            className='size-120'
            name='sort_pref'
            placeholder='Prefix...'
            options={this.props.sortPrefix}
            onChange={this.updateValue('sort_pref')}
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
            onChange={this.updateValue('sort_prop')}
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
              onChange={this.updateValue('direction')}
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
            onChange={this.updateValue('infinite')}
            value={this.state.infinite} />
        </div>
        <div className='row-flex'>
          <span className='form-label'>Autoreloading</span>
          <Toggler
            disabled={running}
            name='autoreload'
            options={{
              'On': this.state.autoreload || 30,
              'Off': 0
            }}
            onChange={this.updateValue('autoreload')}
            value={this.state.autoreload} />
        </div>
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
  sortPrefix: defColumnParameters.sortPrefix,
  sortProperty: defColumnParameters.sortProperty,
  visIconData: [{icon: 'eye', title: 'Show this column'}, {icon: 'eye-with-line', title: 'Hide this column'}]
}