// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { createAction, setAppState, throwError, fetchData, getAllResults } from '../actions/actions';

// Import Child components
// ===========================================================================
import FormLogin from '../components/formLogin';
import FormRegister from '../components/formRegister';

// Authentification screen containing both of auth forms
// ===========================================================================
class Auth extends React.Component {
  // Handle authentification with provided credentials
  // ===========================================================================
  handleAuth(e) {
    e.preventDefault();
    let dispatch = this.props.dispatch;
    let { username, password } = e.target.elements;
    
    dispatch(createAction('login', 8)({
        username: username.value,
        password: password.value
      }))
      .then(() => dispatch(setAppState(1)))
      .then(() => dispatch(fetchData(true)))
      .then((data) => dispatch(getAllResults(data)))
      .then(() => dispatch(setAppState(2)))
      .catch((error) => dispatch(throwError(error)));
  }

  // Handle reaction of a new user
  // ===========================================================================
  handleReg(e) {
    e.preventDefault();
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillMount() {
    this.props.userState && this.props.router.push('/dashboard');
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillUpdate(newProps) {
    newProps && this.props.router.push('/dashboard');
  }

  // Render our screen
  // ===========================================================================
  render() {
    if (this.props.userState) return null;

    // Set default texts for a page
    // ===========================================================================
    let { texts } = this.props;

    // Return JSX layout of a component
    // ===========================================================================
    return (
      <section className='screen-auth mod-authentification' id='funAuthScreen'>
        <article className='welcome-text'>
          <img className='logotype' src='img/logo.svg' title='Trendolier pro' alt='Trendolizer pro' />
          <hgroup className='t-rhythm'>
            <h1 className='t-gutter'>{ texts.title }</h1>
            <h2 className='t-gutter'>{ texts.subtitle }</h2>
          </hgroup>
          <p className='t-rhythm'>{ texts.descr }</p>
          <small className='copyright'>{ texts.copy }</small>
        </article>
        <div className='auth-forms'>
          <FormLogin handler={this.handleAuth.bind(this)} />
          <FormRegister handler={this.handleReg.bind(this)} />
        </div>
      </section>
    );
  }
}

Auth.defaultProps = {
  texts: {
    title: 'Welcome to Trendolizer pro.',
    subTitle: 'Best engine for searching viral content.',
    descr: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis obcaecati, modi nesciunt voluptas distinctio amet doloribus dignissimos. Aut quod atque, dolor facere eum pariatur laboriosam iusto magnam quaerat, dolores quisquam eius animi possimus, minima, accusantium delectus non. Ipsum placeat optio, dignissimos nulla laboriosam labore doloremque commodi dolorem odit dolores, voluptatem.',
    copy: '© 2015 - Trendolizer pro. All rights reserved.'
  }
}

// Connect our Container to State
// @ deps -> App
// ===========================================================================
export default connect(({app}) => ({userState: app.userState}))(Auth);