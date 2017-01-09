// Import utility stuff
// ===========================================================================
import { filter, bindAll } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Select from 'react-select';
import Icon from '../icon';
import Toggler from '../toggler';

// Import actions
// ===========================================================================
import { throwError, readData, updateData, deleteData } from '../../actions/actions';

// Main app screen - Dashboard
// ===========================================================================
class Column extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      createData: readData('result'),
      updateData: updateData('column'),
      deleteData: deleteData('column'),
      throwError: throwError
    }, this.props.dispatch);

    bindAll(this, ['toggleExpandedState', 'deleteColumn', 'hideColumn']);
  }

  renderEditForm () {
    let running = false;
    return (
      <form className='column-settings'>
        <div className='row-flex'>
          <Select
            disabled={running}
            className='size-120'
            name='sort_pref'
            placeholder='Prefix...'
            options={this.props.sortPrefix}
            onChange={null}
            autosize={false}
            clearable={true}
            searchable={false}
          />
          <Select
            disabled={running}
            className='size-180'
            name='sort_prop'
            options={this.props.sortProperty}
            onChange={null}
            autosize={false}
            clearable={false}
            searchable={false}
          />
          <span className={`switcher-direction${(running) ? ' is-disabled' : ''}`}>
            <input
              type='checkbox'
              disabled={running}
              name='direction'
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
              'Yes': this.state.infinite || 30,
              'No': 0
            }}
            onChange={null}
            value={this.state.infinite} />
        </div>
        <div className='row-flex'>
          <span className='form-label'>Autoreloading</span>
          <Toggler
            disabled={running}
            name='autoreloading'
            options={{
              'On': 1,
              'Off': 0
            }}
            onChange={null}
            value={this.state.autoreloading} />
        </div>
        <div className='row-flex column-subnav'>
          
          <a onClick={this.hideColumn} title='Hide this column'>Hide</a>
          <Link to={`columns/${this.props.item.id}`}  title='Column setting screen'>Settings</Link>
          <a onClick={this.deleteColumn} title='Delete this column'>Delete</a>
        </div>
      </form>
    );
  }

  hideColumn(e) {
    e.preventDefault();
    this.actions.updateData({open: 0}).catch(this.actions.throwError);
  }

  deleteColumn(e) {
    e.preventDefault();
    this.actions.deleteData({id: this.props.item.id}).catch(this.actions.throwError);
  }

  toggleExpandedState(e) {
    e.preventDefault();
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    let item = this.props.item;
    return (
      <section className='mod-column'>
        <header className='column-header'>
          <Icon className='drag-handle' icon='dots-three-vertical' />
          <h1 className='funName'>{ item.name }</h1>
          <nav className='nav-links'>
            <a title='Refresh column'><Icon icon='ccw' /></a>
            <a onClick={this.toggleExpandedState} title='Column settings'><Icon icon='cog' /></a>
          </nav>
        </header>
        { (this.state.expanded) ? this.renderEditForm() : null }
        <ul className='entity-list t-scrollable-y'>

        </ul>
      </section>
    );
  }
}

// Take columns and results from state tree
// @deps LINKS
// ===========================================================================
const mapStateToProps = ({links}, ownProps) => {
  return {state: links.state, links: links[ownProps.item.id]}
};

export default connect(mapStateToProps)(Column);