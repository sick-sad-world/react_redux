// Import utility stuff
// ===========================================================================
import { find, filter, concat, includes, bindAll, without, reduce } from 'lodash';
import classNames from 'classnames';
import { inject } from '../../helpers/functions';
import editable from '../behaviours/editable';
import deletable from '../behaviours/deletable';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Import actions
// ===========================================================================
import { createAction, throwError } from '../../actions/actions';

// Import Child components
// ===========================================================================
import FeedsList from './injectable';
import Icon from '../icon';
import Source from './source';

class Edit extends React.Component {
  constructor (props) {
    super(props);
    inject(this, editable);
    inject(this, deletable);
    this.stateMap = {
      name: true,
      source_ids: true
    };
    
    // Bind action handlers to component
    // ===========================================================================
    bindAll(this, ['makeSourceButton', 'sourcesHandler']);

    this.state = Object.assign({
      deleting: 0,
    }, this.mapItemToState(this.props.item));

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      delete: createAction('source', 6),
      update: createAction('set', 5),
      throwError: throwError
    }, this.props.dispatch);

  }

  componentWillReceiveProps(newProps) {
    if (newProps.state <= 2) {
      this.setState(this.mapItemToState(newProps.item));
    }
  }

  // Make button for [own_sources] list
  // @delete for uniq feeds
  // @remove for common one
  // ===========================================================================
  makeSourceButton (uniq_ids, id) {
    if (includes(uniq_ids, id)) {
      return <a onClick={this.makeDeletingStateToggler(id)} title='Delete this source'><Icon icon='trash' /></a>;
    } else {
      return <a onClick={() => this.sourcesHandler('source', id, true)} title='Remove this source from set'><Icon icon='forward' /></a>;
    }
  }

  // Handle change for [source_ids] Array parameter
  // @used: FeedsList, makeSourceButton
  // ===========================================================================
  sourcesHandler (type, id, deleting) {
    let val = (type === 'source') ? id : find(this.props.sets, {id}).source_ids;
    if (deleting) {
      val = without(this.state.source_ids, val);
    } else {
      val = concat(this.state.source_ids, val);
    }
    this._runStatefullAction('source_ids', val);
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item.id || this.props.params.create) return null;
    let running = this.props.state > 3;
    let { item, own_sources, texts } = this.props;

    // Empty item template
    // @ used when items feeds list is empty
    // ===========================================================================
    let empty = <li className='state-empty'>This set has no sources. Please assign some or create.</li>

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'mod-sourceset-edit': true,
      'state-loading': running
    });

    let submanagementClass = classNames({
      'selected': true,
      'state-disabled': running
    });

    // Return DOM layout
    // ===========================================================================
    return (
      <section className={componentRootClass}>
        <header className='subsection-header'>
          <Link to='/sets'>
            <Icon icon='chevron-left' />
          </Link>
          <div className='text'>
            <h1>{`${texts.title} ${(item.name) ? ": '"+item.name+"'" : ''}`}</h1>
            <p>{texts.description}</p>
          </div>
        </header>
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funSetName'>Sourceset name:</label>
              <input 
                disabled={running}
                value={this.state.name}
                onChange={this.updateState}
                onBlur={this.preformAction('name')}
                id='funSetName'
                type='text'
                name='name'
              />
            </div>
            <div className='row'>
              <Link to={{
                pathname: `${this.props.location.pathname}/create`
              }} className='button is-accent'>Create new feeds</Link>
            </div>
          </div>
          <div className='form-block'>
            <h4 className='row'>Feeds management</h4>
            <section className='mod-submanagement'>
              <div className={submanagementClass}>
                <div className='header'>
                  <span>Sourceset has {own_sources.length} sources total.</span>
                </div>
                <ul className='entity-list'>
                  {(own_sources.length) ? reduce(own_sources, (acc, source) => {
                    acc.push(<Source key={source.id} sortable={false} button={this.makeSourceButton(item.uniq_ids, source.id)} {...source} />);
                    if (this.state.deleting === source.id) {
                      acc.push(this.renderDeleteDialog());
                    }
                    return acc;
                  }, []) : empty}
                </ul>
              </div>
              <FeedsList 
                sets={this.props.sets}
                sources={this.props.sources}
                disable={{source: this.state.source_ids}}
                disabled={running}
                selectHandler={this.sourcesHandler}
              />
            </section>
          </div>
        </form>
      </section>
    );
  }
}

Edit.defaultProps = {
  texts: {
    title: 'Edit form',
    description: 'Simple edit form to manipulate entity props'
  }
}

// Transform app state to component props
// @ deps -> Sets, Columns
// ===========================================================================
let mapStateToProps = ({ app, sets, sources }, ownProps) => {
  
  let id = parseInt(ownProps.params.id);
  let otherSets = [];
  let item = {};

  sets.forEach((set) => {
    if (set.id === id) {
      item = set;
    } else {
      otherSets.push(set);
    }
  });

  return {
    state: app.state,
    item,
    type: 'set',
    own_sources: (item.id) ? filter(sources, (source) => includes(item.source_ids, source.id)) : [],
    sources: sources,
    sets: otherSets
  }
};

export default connect(mapStateToProps)(Edit);