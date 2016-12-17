// Import utility stuff
// ===========================================================================
import { find, filter, concat, includes, bindAll, without } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import FeedsList from './injectable';
import Icon from '../icon';
import Source from './source';
import EditFormHeader from '../editHeader';

// Import actions
// ===========================================================================
import createEditActions from '../../helpers/editActions';

class Edit extends React.Component {
  // Bind [changeHandler] to Component 
  // ===========================================================================
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      deleting: 0,
      dialogPos: 0
    }
    bindAll(this, ['makeSourceButton', 'deleteHandler', 'sourcesHandler']);
    this.changeHandler = this.props.changeHandler.bind(this);
  }

  deleteHandler (e, id) {
    e.preventDefault();
    let coord = window.outerHeight - e.target.getBoundingClientRect().bottom - e.target.parentNode.clientHeight;
    //this.props.stateDelete(id, coord);
  }

  makeSourceButton (uniq_ids, id) {
    if (includes(uniq_ids, id)) {
      return <a href='' onClick={(e) => this.deleteHandler(e, id)} title='Delete this source'><Icon icon='trash' /></a>;
    } else {
      return <a href='' onClick={(e) => {
        e.preventDefault();
        this.sourcesHandler('source', id, true);
      }} title='Remove this source from set'><Icon icon='forward' /></a>;
    }
  }

  sourcesHandler (type, id, deleting) {
    let val = (type === 'source') ? id : find(this.props.sets, {id}).source_ids;
    if (deleting) {
      val = without(this.props.item.source_ids, val);
    } else {
      val = concat(this.props.item.source_ids, val);
    }
    this.changeHandler({target: {
      name: 'source_ids',
      value: val
    }});
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item) return null;
    let running = this.props.appState === 3;
    let { item, own_sources } = this.props;
    let empty = <li className='state-empty'>This set has no sources. Please assign some or create.</li>

    // Data for form heading
    // ===========================================================================
    let headingData = {
      title: 'Edit form',
      description: 'Simple edit form to manipulate entity props',
      name: item.name,
      running: running
    };

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'mod-sourceset-edit': true,
      'state-loading': running
    });

    // Return DOM layout
    // ===========================================================================
    return (
      <section className={componentRootClass}>
        <EditFormHeader {...headingData} />
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funSetName'>Sourceset name:</label>
              <input 
                disabled={running}
                defaultValue={item.name}
                onBlur={this.changeHandler}
                id='funSetName'
                type='text'
                name='name'
              />
            </div>
          </div>
          <div className='form-block'>
            <h4 className='row'>Feeds management</h4>
            <section className='mod-submanagement'>
              <div className='selected'>
                <div className='header'>
                  <span>Sourceset has {item.source_ids.length} sources total.</span>
                </div>
                <ul className='entity-list funSelectedItems'>
                  {(own_sources.length) ? own_sources.map((source) => {
                    return <Source key={source.id} sortable={false} button={this.makeSourceButton(item.uniq_ids, source.id)} {...source} />
                  }) : empty}
                </ul>
              </div>
              <FeedsList 
                sets={this.props.sets}
                sources={this.props.sources}
                omit={{set: [item.id], sources: item.source_ids}}
                selectHandler={this.sourcesHandler}
              />
            </section>
          </div>
        </form>
      </section>
    );
  }
}

// Transform app state to component props
// @ deps -> Alert, Columns
// ===========================================================================
let mapStateToProps = ({ sets, sources, app }, ownProps) => {
  let item = find(sets, {id: parseInt(ownProps.params.id)})
  return {
    appState: app.appState,
    type: 'set',
    item: item,
    own_sources: (item) ? filter(sources, (source) => includes(item.source_ids, source.id)) : [],
    sources,
    sets
  }
};

export default connect(mapStateToProps, createEditActions())(Edit);