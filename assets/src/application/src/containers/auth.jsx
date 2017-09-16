// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { initialLoading, setAppState } from '../actions';
import { login, addUser } from 'src/user';

// Import Child components
// ===========================================================================
import FormLogin from '../components/form-login';
import FormRegister from '../components/form-register';
// import Logotype from 'img/logo.svg';

// Authentification screen containing both of auth forms
// ===========================================================================
class Auth extends React.Component {
  // Handle authentification with provided credentials
  // ===========================================================================
  handleAuth(data) {
    this.props.setAppState(3);
    this.props.login(data).then(() => this.props.initialLoading()).catch((err) => {
      this.props.setAppState(2);
    });
  }

  // Handle reaction of a new user
  // ===========================================================================
  handleReg(data) {
    this.props.addUser({ ...data, redirect: window.location.host });
  }

  // Redirect to auth if user is authentificated
  // ===========================================================================
  componentWillMount() {
    this.indexRedirect(this.props);
  }

  // Redirect to auth if user is authentificated
  // ===========================================================================
  componentWillReceiveProps(newProps) {
    this.indexRedirect(newProps);
  }

  indexRedirect(props) {
    if (props.auth && !props.loading) {
      this.props.router.replace('/');
    }
  }

  // Render our screen
  // ===========================================================================
  render() {
    // Set default texts for a page
    // ===========================================================================
    const { texts, loading } = this.props;

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
          <FormLogin loading={loading} handler={this.handleAuth.bind(this)} />
          <FormRegister handler={this.handleReg.bind(this)} />
        </div>
      </section>
    );
  }
}

// Default props
// ===========================================================================
Auth.defaultProps = {
  loading: false,
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
  loading: PropTypes.bool.isRequired,
  auth: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  setAppState: PropTypes.func.isRequired,
  initialLoading: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired
};

export default connect(({ user, app }) => ({
  auth: !!user.payload.id,
  loading: app.state === 3
}), { login, initialLoading, addUser, setAppState }, null, { withRef: true })(Auth);
