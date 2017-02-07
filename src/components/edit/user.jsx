// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';

// Import Child components
// ===========================================================================
import EditForm from './editForm';
import EmailList from '../list/emails';

export default class EditUser extends EditForm {
  mapDataToState (data) {
    return {
      changed: [],
      fullname: data.fullname,
      email: data.email,
      position: data.position,
      email_bcc: data.email_bcc
    };
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'state-loading': running
    });

    return (
      <section className={componentRootClass}>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{this.props.texts.title}</h1>
            <p>{this.props.texts.description}</p>
          </div>
        </header>
        { this.renderConfirmation() }
        <form onSubmit={this.updateHandler} className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funUserDisplayName'>Username:</label>
              <input 
                disabled={running}
                value={this.state.fullname}
                onChange={this.updateState('fullname')}
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
                onChange={this.updateState('position')}
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
                onChange={this.updateState('email')}
                id='funUserEmail'
                type='email'
                name='email'
              />
            </div>
            <div className='row'>
              <h3 className='form-subtitle'>Email BCC assigment:</h3>
              <EmailList
                email={this.state.email}
                data={this.state.email_bcc}
                onChange={this.updateState('email_bcc')}
                onError={(err) => this.props.notification({type: 'error', text: err})}
                />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

EditUser.defaultProps = {
  texts: {
    title: 'Profile settings',
    description: 'Tell us a bit about yourself...',
    confirmation: '{data} was changed. Save changes?'
  }
};