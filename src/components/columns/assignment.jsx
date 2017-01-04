// Import utility stuff
// ===========================================================================
import { find, without, concat, filter, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'React';
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
import { updateData, throwError } from '../../actions/actions';

class Assigment extends React.Component {
  constructor (props) {
    super(props);

    this.state = this.mapItemToState(this.props.item);
    this.manageFeed = this.manageFeed.bind(this);

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      updateData: updateData('column'),
      throwError: throwError
    }, this.props.dispatch);

  }

  componentWillReceiveProps (newProps) {
    this.setState(this.mapItemToState(newProps.item))
  }

  mapItemToState (item) {
    return {
      name: item.name,
      set: (item.data) ? item.data.set : [],
      source: (item.data) ? item.data.source : [],
      own_sets: (item.data) ? filter(this.props.sets, (set) => includes(item.data.set, set.id)) : [],
      own_sources: (item.data) ? filter(this.props.sources, (source) => includes(item.data.source, source.id)) : []
    };
  }

  manageFeed (type, id, deleting) {
    let val = (deleting) ? without(this.state[type], id) : concat(this.state[type], id);

    this.actions.updateData({
      id: this.props.item.id,
      data: JSON.stringify(Object.assign({}, this.props.item.data, {[type]: val}))
    }).catch(this.actions.throwError);
  }

  createDeselectButton (type, id) {
    return <a onClick={() =>this.manageFeed(type, id, true)} title='Remove this ${type} from feeds'><Icon icon='forward' /></a>;
  }

  render() {
    if (!this.props.item.id || !this.props.params.assignment) return null;
    let running = this.props.appState === 3;

    return (
      <section className='mod-subsection-management'>
        <header className='subsection-header'>
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

let mapStateToProps = ({ columns, sets, sources, app }, ownProps) => ({
  appState: app.appState,
  sets,
  sources,
  item: find(columns, {id: parseInt(ownProps.params.id)}) || {}
});

export default connect(mapStateToProps)(Assigment);