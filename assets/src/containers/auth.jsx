// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { setAppState, fetchData } from '../redux/app';
import { getUser, login } from '../redux/user';
import { getColumnsForResults } from '../redux/columns';
import { getAllResults } from '../redux/results';

// Import Child components
// ===========================================================================
import FormLogin from '../components/form-login';
import FormRegister from '../components/form-register';

// Authentification screen containing both of auth forms
// ===========================================================================
class Auth extends React.Component {
  // Handle authentification with provided credentials
  // ===========================================================================
  handleAuth(e) {
    e.preventDefault();
    this.props.login({
        username: e.target.elements.username.value,
        password: e.target.elements.password.value
      })
      .then(() => this.props.setAppState(1))
      .then(() => this.props.getUser(null, { notification: false}))
      .then(() => this.props.fetchData())
      .then(getColumnsForResults)
      .then((data) => this.props.getAllResults(data))
      .then(() => this.props.setAppState(2));
  }

  // Handle reaction of a new user
  // ===========================================================================
  handleReg(e) {
    e.preventDefault();
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillMount() {
    this.props.payload.id && this.props.router.push('/');
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillUpdate(newProps) {
    newProps.payload.id && this.props.router.push('/');
  }

  // Render our screen
  // ===========================================================================
  render() {
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
const mapStateToProps = ({user}) => ({...user});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  login,
  getUser,
  fetchData,
  getAllResults,
  setAppState
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Auth);