// Import helpers
// ===========================================================================
import { includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import child components
// ===========================================================================
import Icon from '../components/icon';
import Source from '../components/list/source';
import FeedsList from '../components/list/feeds';
import Sourceset from '../components/list/sourceset';

// Email injectable Component - provide list of user Emails whatever it need
// ===========================================================================
class Feeds extends React.Component {

  createDeselectButton (type, id) {
    return <a key='deselect' onClick={() =>this.props.action(type, id)} title='Remove this ${type} from feeds'><Icon icon='forward' /></a>;
  }

  render () {
    let cur_sets = this.props.current.set;
    let cur_sources = this.props.current.source;
    return (
      <div className={this.props.className}>
        <div className='selected'>
          <div className='header'>
            <span>Column has {cur_sets.length} sets and {cur_sources.length} sources assigned.</span>
          </div>
          <ul className='entity-list'>
            <li className='list-title'><h4>Sets selected</h4></li>
            { (cur_sets.length) ? this.props.sets.map((set) => {
              if (includes(cur_sets, set.id)) {
                return <Sourceset key={set.id} {...set} buttons={[this.createDeselectButton('set', set.id)]} />;
              } else {
                return null;
              }
            }) : (<li className='state-empty'>{this.props.empty_set}</li>) }
            <li className='list-title'><h4>Sources selected</h4></li>
            { (cur_sources.length) ? this.state.own_sources.map((source) => {
              if (includes(cur_sources, source.id)) {
                return <Source key={source.id} {...source} button={this.createDeselectButton('source', source.id)} />;
              } else {
                return null;
              }
            }) : (<li className='state-empty'>{this.props.empty_source}</li>) }
          </ul>
        </div>
        <FeedsList
          sets={this.props.sets}
          sources={this.props.sources}
          disable={this.props.current}
          disabled={this.props.running}
          action={this.props.action}
        />
      </div>
    );
  }
}

Feeds.defaultProps = {
  empty_set: 'This column dosen\'t watch any sets',
  empty_source: 'This column dosen\'t watch any sources'
}


// Connect our Container to State
// @ deps -> User
// ===========================================================================
const mapStateToProps = ({sets, sources}) => ({
  set_state: sets.state,
  source_state: sources.state,
  sets: sets.payload.map(({id, name, source_ids}) => ({id, name, source_ids, counter: source_ids.length})),
  sources: sources.payload
});

export default connect(mapStateToProps)(Feeds);
