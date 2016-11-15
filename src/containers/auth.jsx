import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { browserHistory } from "react-router";

import { login, register, getAppData } from "../actions/auth";
import getUser from "../actions/user";

import FormLogin from "../components/formLogin";
import FormRegister from "../components/formRegister";

class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pending: false,
      login: '',
      pass: '',
      username: '',
      password: '',
      email: ''
    };
  }

  checkAuthState(auth) {
    if (auth) {
      browserHistory.push("/");
    }
  }

  componentWillMount() {
    _.bindAll(this, ['handleChange', 'handleAuth', 'handleReg']);
    this.checkAuthState(this.props.isLoggedIn);
  }

  componentWillUpdate(newProps) {
    this.checkAuthState(newProps.isLoggedIn);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleAuth(e) {
    e.preventDefault();
    let dispatch = this.props.dispatch;
    this.setState({pending: true}, () => {
      dispatch(login({
          username: this.state.login,
          password: this.state.pass
        }))
        .then(() => dispatch(getUser()))
        .then(() => dispatch(getAppData()))
        .then(() => this.setState({pending: false}));
    })
  }

  handleReg(e) {
    e.preventDefault();
    this.props.dispatch(register({ ...this.state }));
  }

  render() {
    console.log(this);
    let texts = this.props.texts;
    let pendingClass = (this.state.pending) ? "is-pending" : "";
    return (!this.props.isLoggedIn) ? (
      <section className={"screen-auth mod-authentification " + pendingClass} id="funAuthScreen">
        <article className="welcome-text">
          <img className="logotype" src="img/logo.svg" title="Trendolier pro" alt="Trendolizer pro" />
          <hgroup className="t-rhythm">
            <h1 className="t-gutter">{ texts.title }</h1>
            <h2 className="t-gutter">{ texts.subtitle }</h2>
          </hgroup>
          <p className="t-rhythm">{ texts.descr }</p>
          <small className="copyright">{ texts.copy }</small>
        </article>
        <div className="auth-forms">
          <FormLogin handler={this.handleAuth} />
          <FormReg handler={this.handleReg} />
        </div>
      </section>
    ) : null;
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.id,
    texts: {
      title: "Welcome to Trendolizer pro.",
      subTitle: "Best engine for searching viral content.",
      descr: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis obcaecati, modi nesciunt voluptas distinctio amet doloribus dignissimos. Aut quod atque, dolor facere eum pariatur laboriosam iusto magnam quaerat, dolores quisquam eius animi possimus, minima, accusantium delectus non. Ipsum placeat optio, dignissimos nulla laboriosam labore doloremque commodi dolorem odit dolores, voluptatem.",
      copy: "© 2015 - Trendolizer pro. All rights reserved."
    }
  };
}

export default connect(mapStateToProps)(Auth);