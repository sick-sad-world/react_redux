// Import utility stuff
// ===========================================================================
import { find, omitBy, isUndefined, bindAll, pick } from 'lodash';
import classNames from 'classnames';
import { defColumnParameters } from '../../helpers/defaults'; 
import { composeColumnSort } from '../../helpers/functions';

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
import Result from './result';

// Import actions
// ===========================================================================
import { throwError, createAction, getResults } from '../../actions/actions';

// Main app screen - Dashboard
// ===========================================================================
class Column extends React.Component {
  constructor (props) {
    super(props);
    
    let item = this.props.item.data;
    let prefix = find(this.props.sortPrefix, (pref) => item.sort.indexOf(pref.value) > -1);
    let property = find(this.props.sortProperty, (prop) => item.sort.indexOf(prop.value) > -1);
    this.state = {
      expanded: false,
      direction: item.direction,
      infinite: item.infinite,
      autoreload: item.autoreload,
      sort_pref: (prefix) ? prefix.value : '',
      sort_prop: (property) ? property.value : ''
    }

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      update: createAction('column', 5),
      delete: createAction('column', 6),
      refresh: getResults,
      throwError: throwError
    }, this.props.dispatch);

    bindAll(this, ['toggleExpandedState', 'deleteColumn', 'hideColumn', 'refreshResults', 'changeHandler', 'createSelectHandler', 'preformAction']);
  }

  createSelectHandler (name) {
    return (v) => {
      this.setState({
        [name]: (v) ? v.value : v
      }, () => this.preformAction({'sort': composeColumnSort(this.state.sort_pref, this.state.sort_prop)}))
    }
  }

  changeHandler(e) {
    let data = { [e.target.name]: e.target.value };
    this.setState(data, () => this.preformAction(data));
  }

  preformAction(data) {
    let item = this.props.item;
    return this.actions.update({
      id: item.id,
      data: Object.assign({}, item.data, data)
    }).then(() => this.actions.refresh(item.data, item.id)).catch(this.actions.throwError);
  }

  renderEditForm () {
    let running = this.props.state > 2;
    return (
      <form className='column-settings'>
        <div className='row-flex'>
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
        <div className='row-flex'>
          <span className='form-label'>Infinite scroll</span>
          <Toggler
            disabled={running}
            name='infinite'
            options={{
              'Yes': this.state.infinite || 30,
              'No': 0
            }}
            onChange={this.changeHandler}
            value={this.state.infinite} />
        </div>
        <div className='row-flex'>
          <span className='form-label'>Autoreloading</span>
          <Toggler
            disabled={running}
            name='autoreload'
            options={{
              'On': 1,
              'Off': 0
            }}
            onChange={this.changeHandler}
            value={this.state.autoreload} />
        </div>
        <div className='row-flex column-subnav'>
          
          <a onClick={this.hideColumn} title='Hide this column'>Hide</a>
          <Link to={`columns/${this.props.item.id}`}  title='Column setting screen'>Settings</Link>
          <a onClick={this.deleteColumn} title='Delete this column'>Delete</a>
        </div>
      </form>
    );
  }

  renderResults (tableProps) {
    let { display_settings } = this.props.item;
    if (this.props.data.length) {
      return this.props.data.map((result) => <Result key={result.id} displaySettings={display_settings} {...tableProps} {...result} />);
    } else {
      return (<li className='state-empty'>{this.props.stateEmpty}</li>);
    }
  }

  renderResultState () {
    switch (this.props.state) {
      case 1:
        return (<li className='state-default'>{this.props.statePending}</li>);
      case 3:
        return (<li className='state-loading'><img src='img/loading.svg' alt='Content is being loaded' />{this.props.stateLoading}</li>);
      case 0:
        return (<li className='state-error'><Icon icon='new' />{this.props.stateError}</li>);
    }
  }

  hideColumn(e) {
    e.preventDefault();
    this.actions.update({open: 0}).catch(this.actions.throwError);
  }

  deleteColumn(e) {
    e.preventDefault();
    this.actions.delete({id: this.props.item.id}).catch(this.actions.throwError);
  }

  toggleExpandedState(e) {
    e.preventDefault();
    this.setState({
      expanded: !this.state.expanded
    });
  }

  refreshResults (e) {
    e.preventDefault();
    let item = this.props.item;
    this.actions.refresh(omitBy(item.data, isUndefined), item.id).catch(this.actions.throwError);
  }

  render() {
    let item = this.props.item;
    let tableProps = pick(this.props, ['tableRange', 'tableTexts', 'tableStats']);
    return (
      <section className='mod-column'>
        <header className='column-header'>
          <Icon className='drag-handle' icon='dots-three-vertical' />
          <h1 className='funName'>{ item.name }</h1>
          <nav className='nav-links'>
            <a title='Refresh column' onClick={this.refreshResults}><Icon icon='ccw' /></a>
            <a onClick={this.toggleExpandedState} title='Column settings'><Icon icon='cog' /></a>
          </nav>
        </header>
        { (this.state.expanded) ? this.renderEditForm() : null }
        <ul className='entity-list t-scrollable-y'>
          {(this.props.state === 2) ? this.renderResults(tableProps) : this.renderResultState()}
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
  state: 1,
  data: [],
  sortPrefix: defColumnParameters.sortPrefix,
  sortProperty: defColumnParameters.sortProperty
}

// Take columns and results from state tree
// @deps LINKS
// ===========================================================================
const mapStateToProps = ({links}, ownProps) => (links[ownProps.item.id] || {});

export default connect(mapStateToProps)(Column);