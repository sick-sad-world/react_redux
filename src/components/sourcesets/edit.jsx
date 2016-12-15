// Import utility stuff
// ===========================================================================
import { find, pick, assign } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import Select from 'react-select';
import Datetime from 'react-datetime';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import FeedsList from './injectable';
import Toggler from '../toggler';
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
      loading: false
    }
    this.changeHandler = this.props.changeHandler.bind(this);
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item) return null;
    let item = this.props.item;
    let running = this.props.appState === 3

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
                <ul className='entity-list funSelectedItems'></ul>
              </div>
              <FeedsList omit={{sets: [item.id], sources: item.source_ids}} selectHandler={(data) => {}} />
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
let mapStateToProps = ({ sets, sources, app }, ownProps) => ({
  appState: app.appState,
  type: 'set',
  item: find(sets, {id: parseInt(ownProps.params.id)})
});

export default connect(mapStateToProps, createEditActions())(Edit);