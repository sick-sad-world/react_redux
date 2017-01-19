// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { inject } from '../../helpers/functions';
import editable from '../behaviours/editable';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { createAction, throwError } from '../../actions/actions';

// Import Child components
// ===========================================================================
import EmailList from './injectable';

class Edit extends React.Component {
  constructor (props) {
    super(props);
    inject(this, editable);
    this.stateMap = {
      fullname: true,
      email: true,
      position: true
    }

    this.state = this.mapItemToState(this.props.item);

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      update: createAction('user', 5),
      throwError: throwError
    }, this.props.dispatch);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.state <= 2) {
      this.setState(this.mapItemToState(newProps.item));
    }
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item.id) return null;
    let running = this.props.state > 3;

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'state-loading': running
    });

    // Return DOM layout
    // ===========================================================================
    return (
      <section className={componentRootClass}>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{this.props.texts.title}</h1>
            <p>{this.props.texts.description}</p>
          </div>
        </header>
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funUserDisplayName'>Username:</label>
              <input 
                disabled={running}
                value={this.state.fullname}
                onChange={this.updateState}
                onBlur={this.preformAction('fullname')}
                id='funUserDisplayName'
                type='text'
                name='fullname'
              />
            </div>
            <div className='row'>
              <label htmlFor='funUserPosition'>Position:</label>
              <input 
                disabled={running}
                value={this.state.position}
                onChange={this.updateState}
                onBlur={this.preformAction('position')}
                id='funUserPosition'
                type='text'
                name='position'
              />
            </div>
            <div className='row'>
              <label htmlFor='funUserEmail'>Email:</label>
              <input 
                disabled={running}
                value={this.state.email}
                onChange={this.updateState}
                onBlur={this.preformAction('email')}
                id='funUserEmail'
                type='email'
                name='email'
              />
            </div>
            <div className='row'>
              <h3 className='form-subtitle'>Email BCC assigment:</h3>
              <EmailList
                className='row'
                disabled={running}
                empty={<li className='is-default'>No email bcc created yet. All alerts/reports will be sended to main email.</li>}
                description='This additional e-mail adresses may be used to send alerts or reports'
              />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

// Default common data for Edit form
// ===========================================================================
Edit.defaultProps = {
  texts: {
    title: 'Profile settings',
    description: 'Tell us a bit about yourself...',
    name: ''
  }
}

// Transform app state to component props
// @ deps -> User, App
// ===========================================================================
const mapStateToProps = ({ app, user }) => {
  // Return prepared data
  // ===========================================================================
  return {
    state: app.state,
    item: user
  }
};

export default connect(mapStateToProps)(Edit);