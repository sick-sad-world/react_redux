// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { setAppState, fetchData } from '../actions';
import { getUser, login, addUser } from 'src/user/actions';
import { getColumnsForResults } from 'src/columns/helpers';
import { getAllResults } from 'src/results/actions';

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
    });
  }

  // Handle reaction of a new user
  // ===========================================================================
  handleReg(e) {
    e.preventDefault();
    const { name, email, password } = e.target.elements;
    this.props.addUser({
      name: name.value,
      email: email.value,
      password: password.value,
      redirect: window.location.host
    }).then(() => {
      name.value = '';
      email.value = '';
      password.value = '';
    });
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillMount() {
    if (this.props.auth) {
      this.props.router.push('/');
    }
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillUpdate(newProps) {
    if (newProps.auth) {
      this.props.router.push('/');
    }
  }

  // Render our screen
  // ===========================================================================
  render() {
    // Set default texts for a page
    // ===========================================================================
    const { texts } = this.props;

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

// Default props
// ===========================================================================
Auth.defaultProps = {
  texts: {
    title: 'Welcome to Trendolizer pro.',
    subTitle: 'Best engine for searching viral content.',
    descr: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis obcaecati, modi nesciunt voluptas distinctio amet doloribus dignissimos. Aut quod atque, dolor facere eum pariatur laboriosam iusto magnam quaerat, dolores quisquam eius animi possimus, minima, accusantium delectus non. Ipsum placeat optio, dignissimos nulla laboriosam labore doloremque commodi dolorem odit dolores, voluptatem.',
    copy: '© 2015 - Trendolizer pro. All rights reserved.'
  }
};

// Proptypes validation
// ===========================================================================
Auth.propTypes = {
  texts: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    descr: PropTypes.string.isRequired,
    copy: PropTypes.string.isRequired
  }).isRequired,
  auth: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

// Connect our Container to State
// @ deps -> App
// ===========================================================================
const mapStateToProps = ({ user }) => ({ auth: !!user.payload.id });

const mapDispatchToProps = dispatch => ({
  login(data) {
    return dispatch(login(data))
      .then(() => dispatch(getUser(null, { notification: false })))
      .then(() => dispatch(fetchData()))
      .then(getColumnsForResults)
      .then(dispatch(getAllResults))
      .then(() => dispatch(setAppState(2)));
  },
  addUser(data) {
    return dispatch(addUser(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
