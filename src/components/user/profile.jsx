// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import EmailList from './injectable';
import EditFormHeader from '../editHeader';
import PageEdit from '../pageEdit';

class Edit extends PageEdit {
  constructor (props) {
    super(props);

    // Bind action handlers to component
    // ===========================================================================
    bindAll(this, ['preformAction', 'inputHandler', 'createSelectHandler']);
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item.id) return null;
    let item = this.props.item;
    let running = this.props.appState === 3;

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
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funUserDisplayName'>Username:</label>
              <input 
                disabled={running}
                defaultValue={item.fullname}
                onBlur={this.inputHandler}
                id='funUserDisplayName'
                type='text'
                name='fullname'
              />
            </div>
            <div className='row'>
              <label htmlFor='funUserPosition'>Position:</label>
              <input 
                disabled={running}
                defaultValue={item.position}
                onBlur={this.inputHandler}
                id='funUserPosition'
                type='text'
                name='position'
              />
            </div>
            <div className='row'>
              <h3 className='form-subtitle'>Email BCC assigment:</h3>
              <EmailList email={item.email} email_bcc={item.email_bcc} className='row' disabled={running} />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

// Transform app state to component props
// @ deps -> User, App
// ===========================================================================
const mapStateToProps = ({ app, user }) => {
  // Return prepared data
  // ===========================================================================
  return {
    appState: app.appState,
    type: 'user',
    item: user
  }
};

export default connect(mapStateToProps)(Edit);