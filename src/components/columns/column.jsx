// Import utility stuff
// ===========================================================================
import { filter } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Main app screen - Dashboard
// ===========================================================================
export default class Column extends React.Component {
  render() {
    return (
      <section className='mod-column'>
        <header className="column-header">
          <h1 className="funName">{ item.name }</h1>
          <nav className="nav-links">
            <a href="" className="btn-refresh a-rotate-hover" title="Refresh column"></a>
            <a href="" className="btn-settings" title="Column settings"></a>
          </nav>
        </header>
        <form className="column-settings">
          <div className="form-row-half">
            <Select
              disabled={running}
              className='size-120'
              name='sort_pref'
              placeholder='Prefix...'
              options={this.props.sortPrefix}
              onChange={this.createSelectHandler('sort_pref')}
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
              onChange={this.createSelectHandler('sort_prop')}
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
                onChange={this.changeHandler}
                checked={this.state.direction === 'desc'}
                value={(this.state.direction === 'desc') ? 'asc' : 'desc'}
              />
              <Icon icon='bar-graph' />
            </span>
          </div>
          <div className="form-row-half">
            <span className="form-label">Infinite scroll</span>
            <Toggler />
          </div>
          <div className="form-row-half">
            <span className="form-label">Autoreloading</span>
            <Toggler />
          </div>
          <div className="form-row-half column-subnav">
            <button className="funHideColumn" data-icon="" title="Hide this column">Hide</button>
            <a href="#columns/<%= id %>" className="is-button" data-icon="" title="Column setting screen">Settings</a>
            <button className="funDelete" data-icon="" title="Delete this column">Delete</button>
          </div>
        </form>
        <ul className="entity-list t-scrollable-y">

        </ul>
      </section>
    );
  }
};