// Import utility stuff
// ===========================================================================
import { find, map, pick, filter, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import FeedsList from '../sourcesets/injectable';
import Set from '../sourcesets/sourceset';
import Source from '../sourcesets/source';

class Assigment extends React.Component {
  constructor (props) {
    super(props);

    this.state = this.mapItemToState(this.props.item);
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
              <span>Sourceset has {this.state.set.length} sets and {this.state.source.length} sources total.</span>
            </div>
            <ul className='entity-list'>
              <li className='list-title'><h4>Sets selected</h4></li>
              { (this.state.own_sets.length) ? this.state.own_sets.map((set) => {
                
              }) : (<li className='state-empty'>{this.props.texts.empty_set}</li>) }
              <li className='list-title'><h4>Sources selected</h4></li>
              { (this.state.own_sources.length) ? this.state.own_sources.map((set) => {
                
              }) : (<li className='state-empty'>{this.props.texts.empty_source}</li>) }
            </ul>
          </div>
          <FeedsList 
            sets={this.props.sets}
            sources={this.props.sources}
            omit={{set: this.state.set, sources: this.state.source}}
            disabled={running}
            selectHandler={this.sourcesHandler}
          />
        </div>
      </section>
    );
  }
};

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