import _ from "lodash";
import React from "react";
import { connect } from "react-redux";

import { login, register, getAppData } from "../actions/auth";
import getUser from "../actions/user";

import FormLogin from "../components/formLogin";
import FormRegister from "../components/formRegister";

class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pending: false
    };

    _.bindAll(this, ["handleAuth", "handleReg"]);
  }

  checkAuthState(auth) {
    auth && this.props.router.push("/")
  }

  componentWillMount() {
    this.checkAuthState(this.props.isLoggedIn);
  }

  componentWillUpdate(newProps) {
    this.checkAuthState(newProps.isLoggedIn);
  }

  handleAuth(e) {
    e.preventDefault();
    let dispatch = this.props.dispatch;
    let { username, password } = e.target.elements;

    this.setState({pending: true}, () => {
      dispatch(login({
          username: username.value,
          password: password.value
        }))
        .then(() => dispatch(getUser()))
        .then(() => dispatch(getAppData()))
        .then(() => this.setState({pending: false}));
    });
  }

  handleReg(e) {
    e.preventDefault();
    this.props.dispatch(register({ ...this.state }));
  }

  render() {
    let texts = this.props.texts;
    let pendingClass = (this.state.pending) ? "is-pending" : "";
    console.log("Auth view updated");
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
          <FormLogin handler={this.handleAuth} pending={this.state.pending} />
          <FormRegister handler={this.handleReg} pending={this.state.pending} />
        </div>
      </section>
    ) : null;
  }
}

function mapStateToProps({user}) {
  return {
    isLoggedIn: user.id,
    texts: {
      title: "Welcome to Trendolizer pro.",
      subTitle: "Best engine for searching viral content.",
      descr: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis obcaecati, modi nesciunt voluptas distinctio amet doloribus dignissimos. Aut quod atque, dolor facere eum pariatur laboriosam iusto magnam quaerat, dolores quisquam eius animi possimus, minima, accusantium delectus non. Ipsum placeat optio, dignissimos nulla laboriosam labore doloremque commodi dolorem odit dolores, voluptatem.",
      copy: "© 2015 - Trendolizer pro. All rights reserved."
    }
  };
}

export default connect(mapStateToProps)(Auth);