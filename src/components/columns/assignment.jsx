// Import utility stuff
// ===========================================================================
import { find, filter, includes, bindAll } from 'lodash';
import { inject, composeColumData, shouldFetchResults, normalizeColumn } from '../../helpers/functions';
import editable from '../behaviours/editable';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Icon from '../icon';
import FeedsList from '../sourcesets/injectable';
import Sourceset from '../sourcesets/sourceset';
import Source from '../sourcesets/source';

// Import actions
// ===========================================================================
import { createAction, getResults, throwError } from '../../actions/actions';
import { defColumn } from '../../helpers/defaults';

class Assigment extends React.Component {
  constructor (props) {
    super(props);
    inject(this, editable);
    this.stateMap = {
      name: true,
      set: (item) => item.data.set,
      source: (item) => item.data.source,
      own_sets: (item) => filter(this.props.sets, (set) => includes(item.data.set, set.id)),
      own_sources: (item) => filter(this.props.sources, (source) => includes(item.data.source, source.id))
    }

    bindAll(this, ['manageFeed']);

    // Bind action handlers to component
    // ===========================================================================
    this.state = this.mapItemToState(this.props.item);

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      update: createAction('column', 5),
      refresh: getResults,
      throwError: throwError
    }, this.props.dispatch);

  }

  componentWillReceiveProps (newProps) {
    if (newProps.state <= 2) {
      this.setState(this.mapItemToState(newProps.item));
    }
  }

  manageFeed (type, feed) {
    let { id, data } = this.props.item;
    let result = composeColumData.call(this, data, type, feed);
    if (!result) return;
    this.actions.update({id, data: result}).then(({payload}) => {
      return (shouldFetchResults(payload, name)) ? this.actions.refresh(payload.data, {id}) : null;
    }).catch(this.actions.throwError);
  }

  createDeselectButton (type, id) {
    return <a key='deselect' onClick={() =>this.manageFeed(type, id)} title='Remove this ${type} from feeds'><Icon icon='forward' /></a>;
  }

  render() {
    if (!this.props.item.id || !this.props.params.assignment) return null;
    let running = this.props.state > 3;

    return (
      <section className='mod-subsection-management'>
        <header className='subsection-header'>
          <Link to={`/columns/${this.props.item.id}`}>
            <Icon icon='chevron-left' />
          </Link>
          <div className='text'>
            <h1>{this.props.texts.title}: "{this.state.name}"</h1>
            <p>{this.props.texts.description}</p>
          </div>
        </header>
        <div className='subsection-content mod-submanagement'>
          <div className='selected'>
            <div className='header'>
              <span>Column has {this.state.set.length} sets and {this.state.source.length} sources assigned.</span>
            </div>
            <ul className='entity-list'>
              <li className='list-title'><h4>Sets selected</h4></li>
              { (this.state.own_sets.length) ? this.state.own_sets.map((set) => {
                return <Sourceset key={set.id} {...set} buttons={[this.createDeselectButton('set', set.id)]} />
              }) : (<li className='state-empty'>{this.props.texts.empty_set}</li>) }
              <li className='list-title'><h4>Sources selected</h4></li>
              { (this.state.own_sources.length) ? this.state.own_sources.map((source) => {
                return <Source key={source.id} {...source} button={this.createDeselectButton('source', source.id)} />
              }) : (<li className='state-empty'>{this.props.texts.empty_source}</li>) }
            </ul>
          </div>
          <FeedsList 
            sets={this.props.sets}
            sources={this.props.sources}
            disable={{set: this.state.set, source: this.state.source}}
            disabled={running}
            selectHandler={this.manageFeed}
          />
        </div>
      </section>
    );
  }
}

// Assign default text to component
// ===========================================================================
Assigment.defaultProps = {
  texts: {
    title: 'Assign feeds to column',
    description: 'Pick the sourcesets and sources this column to watch here.',
    empty_set: 'This column dosen\'t watch any sets',
    empty_source: 'This column dosen\'t watch any sources'
  }
};

let mapStateToProps = ({ app, columns, sets, sources }, ownProps) => ({
  state: app.state,
  sets: sets,
  sources: sources,
  item: normalizeColumn(find(columns, {id: parseInt(ownProps.params.id)}), defColumn)
});

export default connect(mapStateToProps)(Assigment);