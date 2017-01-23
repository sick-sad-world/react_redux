// Import utility stuff
// ===========================================================================
import { find, bindAll, pick, debounce } from 'lodash';
import editable from '../behaviours/editable';
import deletable from '../behaviours/deletable';
import { defColumnParameters } from '../../helpers/defaults'; 
import { inject, composeColumData, shouldFetchResults } from '../../helpers/functions';

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
import { throwError, createAction, createResultAction } from '../../actions/actions';

// Main app screen - Dashboard
// ===========================================================================
class Column extends React.Component {
  constructor (props) {
    super(props);
    
    // Inject behaviours
    // ===========================================================================
    inject(this, editable);
    inject(this, deletable);

    this.interval = null;
    this.infinite = false;
    this.stateMap = {
      infinite: (item) => item.data.infinite,
      direction: (item) => item.data.direction,
      sort_pref (item) {
        let prefix = item.data.sort && find(this.props.sortPrefix, (pref) => item.data.sort.indexOf(pref.value) > -1);
        return (prefix) ? prefix.value : '';
      },
      sort_prop (item) {
        let property = item.data.sort && find(this.props.sortProperty, (prop) => item.data.sort.indexOf(prop.value) > -1);
        return (property) ? property.value : '';
      },
      autoreload: (item) => {
        let ar = item.data.autoreload;
        if (!ar) {
          clearInterval(this.interval);
          this.interval = null;
        } else if (ar > 0 && ar !== this.props.item.data.autoreload) {
          this.interval = setInterval(this.refreshResults.bind(this), ar * 1000);
        }
        return ar;
      }
    };
    
    // Bind methods to instance
    // ===========================================================================
    bindAll(this, ['expandedStateToggler', 'hideColumn', 'refreshResults', 'preformAction', 'scrollHandler', 'makeResultAction']);
    this.debouncedScrollHandler = debounce(this.scrollHandler, 250);

    this.state = Object.assign({
      deleting: false,
      expanded: false
    }, this.mapItemToState(this.props.item));

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      update: createAction('column', 5),
      delete: createAction('column', 6),
      getResults: createResultAction(3),
      getResult: createResultAction(8),
      throwError: throwError
    }, this.props.dispatch);

  }

  componentWillReceiveProps (newProps) {
    if (newProps.state <= 2) {
      this.setState(this.mapItemToState(newProps.item));
    }
  }

  // [Preformaction] editable interaction method overriding
  // @support custom [data] logic
  // ===========================================================================
  preformAction(name) {
    return () => {
      let { id, data } = this.props.item;
      let result = composeColumData.call(this, data, name, this.state[name]);
      if (!result) return;
      this.actions.update(result, { id }).then(({payload}) => {
        return (shouldFetchResults(payload, name)) ? this.actions.getResults(payload.data, { id }) : null;
      }).catch(this.actions.throwError);
    };
  }

  // Render settings part of column
  // @return -> DOM
  // ===========================================================================
  renderEditForm () {
    let running = this.props.state > 3;
    let open = this.props.item.open;
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
            onChange={this.makeSelectHandler('sort_pref')}
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
            onChange={this.makeSelectHandler('sort_prop')}
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
          <Link to={`columns/${this.props.item.id}`}  title='Column setting screen'><Icon icon='cog' />Settings</Link>
          <a onClick={this.makeDeletingStateToggler(this.props.item.id)} title='Delete this column'><Icon icon='trash' />Delete</a>
        </div>
      </form>
    );
  }

  // Render results
  // @map -> results, @return -> DOM Array
  // ===========================================================================
  renderResults (sort, tableProps) {
    return this.props.data.map((result) => {
      return <Result 
                key={result.id}
                sort={sort}
                makeAction={this.makeResultAction} 
                displaySettings={this.props.item.display_settings}
                {...tableProps} 
                {...result}
            />
    })
  }

  // Render different result state empty, error, loading, init
  // @return -> DOM
  // ===========================================================================
  renderResultState () {
    switch (this.props.resultState) {
      case 1:
        return (<li className='state-default'>{this.props.statePending}</li>);
      case 2:
        return (<li className='state-empty'>{this.props.stateEmpty}</li>);
      case 3:
        return (<li className='state-loading'><img src='img/loading.svg' alt='Content is being loaded' />{this.props.stateLoading}</li>);
      case 0:
        return (<li className='state-error'><Icon icon='new' />{this.props.stateError}</li>);
    }
  }

  // Handler to run [delete] Column action
  // ===========================================================================
  hideColumn() {
    this.actions.update({open: 0}).catch(this.actions.throwError);
  }

  // Make toggler handler for simple state prop true/false
  // ===========================================================================
  expandedStateToggler() {
    this.setState({ expanded: !this.state.expanded });
  }

  // Run [Refresh] actions
  // @fetch result for a single column
  // ===========================================================================
  refreshResults () {
    let item = this.props.item;
    this.actions.getResults(item.data, {id: item.id}).catch(this.actions.throwError);
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

  makeResultAction(action, hash) {
    let id = this.props.item.id;
    return () => {
      switch (action) {
        case 'refresh':
          return this.actions.getResult({hash}, {id, state: false}).catch(this.actions.throwError);
      }
    }
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
            <a title='Refresh column' onClick={this.refreshResults}><Icon icon='cw' /></a>
            <a onClick={this.expandedStateToggler} title='Column settings'><Icon icon='cog' /></a>
          </nav>
        </header>
        { (this.state.expanded) ? this.renderEditForm() : null }
        { (this.state.deleting) ? this.renderDeleteDialog() : null }
        <ul className='entity-list' onScroll={(this.state.infinite) ? (e) => {
          e.persist();
          this.debouncedScrollHandler(e);
        } : null}>
          {(this.props.resultState === 2 && this.props.data.length) ? this.renderResults(item.data.sort, tableProps) : this.renderResultState()}
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
  resultState: 1,
  data: [],
  sortPrefix: defColumnParameters.sortPrefix,
  sortProperty: defColumnParameters.sortProperty,
  visIconData: [{icon: 'eye', title: 'Show this column'}, {icon: 'eye-with-line', title: 'Hide this column'}]
}

// Take columns and results from state tree
// @deps LINKS
// ===========================================================================
const mapStateToProps = ({links}, ownProps) => {
  if (links[ownProps.item.id]) {
    return {
      resultState: links[ownProps.item.id].state,
      data: links[ownProps.item.id].data
    };
  } else {
    return {};
  }
};

export default connect(mapStateToProps)(Column);