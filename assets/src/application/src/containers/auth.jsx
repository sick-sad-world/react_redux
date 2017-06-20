// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { initialLoading } from '../actions';
import { login, addUser } from 'src/user';

// Import Child components
// ===========================================================================
import FormLogin from '../components/form-login';
import FormRegister from '../components/form-register';
import Logotype from 'img/logo.svg';

// Authentification screen containing both of auth forms
// ===========================================================================
class Auth extends React.Component {
  // Handle authentification with provided credentials
  // ===========================================================================
  handleAuth(data) {
    this.props.login(data, { notification: false }).then(() => this.props.initialLoading(true));
  }

  // Handle reaction of a new user
  // ===========================================================================
  handleReg(data) {
    this.props.addUser({ ...data, redirect: window.location.host });
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
  componentWillReceiveProps(newProps) {
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
          <img className='logotype' src={Logotype} title='Trendolier pro' alt='Trendolizer pro' />
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
  initialLoading: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default connect(({ user }) => ({ auth: !!user.payload.id }), { login, initialLoading, addUser })(Auth);
