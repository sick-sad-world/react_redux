// Import utility stuff
// ===========================================================================
import { find, filter, concat, includes, bindAll, without } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import FeedsList from './injectable';
import DeletingPopup from '../deletingPopup';
import Icon from '../icon';
import Source from './source';
import EditFormHeader from '../editHeader';

// Import actions
// ===========================================================================
import { createData, updateData, deleteData, throwError } from '../../actions/actions';

class Edit extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      deleting: 0,
      dialogPos: 0
    }

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      createData: createData('set'),
      updateData: updateData('set'),
      deleteData: deleteData('source'),
      throwError: throwError
    }, this.props.dispatch);

    // Bind action handlers to component
    // ===========================================================================
    bindAll(this, ['preformAction', 'inputHandler', 'makeSourceButton', 'deleteHandler', 'sourcesHandler']);
  }

  // Set [delete] state, to show confirmation dialog
  // ===========================================================================
  stateDelete (id, dialogPos) {
    this.setState({
      deleting: (this.state.deleting === id) ? 0 : id,
      dialogPos: (this.state.dialogPos === dialogPos) ? 0 : dialogPos,
    });
  }

  // Send request to server with new props 
  // ===========================================================================
  preformAction (data) {
    if (this.props.item.id) {
      // Modify if item is already existed
      // ===========================================================================
      this.actions.updateData(Object.assign({id: this.props.item.id}, data)).catch(this.actions.throwError);
    } else {
      // Create item if ID == 0
      // ===========================================================================
      this.actions.createData(Object.assign({}, this.props.item, data)).then(({payload}) => {
        this.props.router.push(`/${this.props.type}s/${payload.id}`);
      }).catch(this.actions.throwError);
    }
  }

  // Input handler 
  // -> Function which handles action change
  // ===========================================================================
  inputHandler(e) {
    this.preformAction({
      [e.target.name]: e.target.value
    });
  }

  deleteHandler (e, id) {
    e.preventDefault();
    let coord = window.outerHeight - e.target.getBoundingClientRect().bottom - e.target.parentNode.clientHeighе;
    this.stateDelete(id, coord);
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
    this.preformAction({['source_ids']: val});
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item) return null;
    let running = this.props.appState === 3;
    let { item, own_sources } = this.props;

    // Empty item template
    // @ used when items feeds list is empty
    // ===========================================================================
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

    let submanagementClass = classNames({
      'selected': true,
      'state-disabled': running
    });

    // Make confirmation dialog if item deletable and [deleting] state active
    // ===========================================================================
    let confimation = (this.state.deleting > 0 && this.state.dialogPos > 0) ? (
      <DeletingPopup dialogPos={{top: `${this.state.dialogPos}px`}} handlerDelete={this.handlerDelete} handlerCancel={e => this.stateDelete(0, 0)} />
    ) : null;

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
                onBlur={this.inputHandler}
                id='funSetName'
                type='text'
                name='name'
              />
            </div>
          </div>
          <div className='form-block'>
            <h4 className='row'>Feeds management</h4>
            <section className='mod-submanagement'>
              <div className={submanagementClass}>
                <div className='header'>
                  <span>Sourceset has {item.source_ids.length} sources total.</span>
                </div>
                <ul className='entity-list funSelectedItems'>
                  {(own_sources.length) ? own_sources.map((source) => {
                    return <Source key={source.id} sortable={false} button={this.makeSourceButton(item.uniq_ids, source.id)} {...source} />
                  }) : empty}
                </ul>
                { confimation }
              </div>
              <FeedsList 
                sets={this.props.sets}
                sources={this.props.sources}
                omit={{set: [item.id], sources: item.source_ids}}
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

// Transform app state to component props
// @ deps -> Sets, Columns
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

export default connect(mapStateToProps)(Edit);