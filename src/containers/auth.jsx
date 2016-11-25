import { bindAll } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { login, setAppState, throwError, fetchData } from '../actions/actions';

import FormLogin from '../components/formLogin';
import FormRegister from '../components/formRegister';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, ['handleAuth', 'handleReg']);
  }

  checkAuthState(auth) {
    auth && this.props.router.push('/')
  }

  componentWillMount() {
    this.checkAuthState(this.props.userState);
  }

  componentWillUpdate(newProps) {
    this.checkAuthState(newProps.userState);
  }

  handleAuth(e) {
    e.preventDefault();
    let dispatch = this.props.dispatch;
    let { username, password } = e.target.elements;
    dispatch(setAppState(1));
    dispatch(login({
        username: username.value,
        password: password.value
      }))
      .then(() => dispatch(fetchData(true, true)))
      .catch((error) => dispatch(throwError(error)))
      .then(() => dispatch(setAppState(2)));
  }

  handleReg(e) {
    e.preventDefault();
  }

  render() {
    let texts = {
      title: 'Welcome to Trendolizer pro.',
      subTitle: 'Best engine for searching viral content.',
      descr: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis obcaecati, modi nesciunt voluptas distinctio amet doloribus dignissimos. Aut quod atque, dolor facere eum pariatur laboriosam iusto magnam quaerat, dolores quisquam eius animi possimus, minima, accusantium delectus non. Ipsum placeat optio, dignissimos nulla laboriosam labore doloremque commodi dolorem odit dolores, voluptatem.',
      copy: '© 2015 - Trendolizer pro. All rights reserved.'
    };

    return (!this.props.userState && this.props.appState >= 2) ? (
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
          <FormLogin handler={this.handleAuth} />
          <FormRegister handler={this.handleReg} />
        </div>
      </section>
    ) : null;
  }
}

function mapStateToProps({app}) {
  return {
    userState: app.userState,
    appState: app.appState
  };
}

export default connect(mapStateToProps)(Auth);