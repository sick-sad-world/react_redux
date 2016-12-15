// Import utility stuff
// ===========================================================================
import { find, pick, assign } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import Select from 'react-select';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import EmailList from '../sourcesets/injectable';
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
      'state-loading': running
    });

    // Return DOM layout
    // ===========================================================================
    return (
      <section className={componentRootClass}>
        <EditFormHeader {...headingData} />
        <form className='subsection-content columned'>
          <div className='row'>
            <label htmlFor='funColumnName'>Column name:</label>
            <input 
              disabled={running}
              defaultValue={item.name}
              onBlur={this.changeHandler}
              id='funColumnName'
              type='text'
              name='name'
            />
          </div>
        </form>
      </section>
    );
  }
}

// Transform app state to component props
// @ deps -> Alert, Columns
// ===========================================================================
let mapStateToProps = ({ columns, sets, sources, app }, ownProps) => ({
  appState: app.appState,
  type: 'column',
  item: find(columns, {id: parseInt(ownProps.params.id)})
});

export default connect(mapStateToProps, createEditActions())(Edit);