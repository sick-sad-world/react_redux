import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { login, register } from "../actions/auth";

class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      pass: '',
      username: '',
      password: '',
      email: ''
    };

    if (this.props.isLoggedIn) {
      this.props.router.replace("/");
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.handleReg = this.handleReg.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleAuth(e) {
    e.preventDefault();
    this.props.dispatch(login({
      username: this.state.login,
      password: this.state.pass
    }));
  }

  handleReg(e) {
    e.preventDefault();
    this.props.dispatch(register({ ...this.state }));
  }

  render() {
    let texts = this.props.texts;
    return (
      <section className="screen-auth mod-authentification" id="funAuthScreen">
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
          <form action="login" onSubmit={this.handleAuth}>
            <h3>Log in</h3>
            <div className="row">
              <input type="text" name="login" placeholder="Your login" value={this.state.login} onChange={this.handleChange} />
            </div>
            <div className="row-flex">
              <input type="password" name="pass" placeholder="Your password" value={this.state.pass} onChange={this.handleChange} />
              <input type="submit" className="is-alt" value="Log in" />
            </div>
          </form>
          <form action="create" onSubmit={this.handleReg}>
            <h3>New to Trendolizer?</h3>
            <div className="message"></div>
            <div className="row">
              <input type="text" name="username" placeholder="Your login" value={this.state.username} onChange={this.handleChange} />
            </div>
            <div className="row">
              <input type="email" name="email" placeholder="Your email" value={this.state.email} onChange={this.handleChange} />
            </div>
            <div className="row">
              <input type="password" name="password" placeholder="Your password" value={this.state.password} onChange={this.handleChange} />
            </div>
            <div className="row">
              <input type="submit" className="is-alt" value="Create account" />
            </div>
          </form>
        </div>
      </section>
    );
  }
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user && state.user.id,
    texts: {
      title: "Welcome to Trendolizer pro.",
      subTitle: "Best engine for searching viral content.",
      descr: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis obcaecati, modi nesciunt voluptas distinctio amet doloribus dignissimos. Aut quod atque, dolor facere eum pariatur laboriosam iusto magnam quaerat, dolores quisquam eius animi possimus, minima, accusantium delectus non. Ipsum placeat optio, dignissimos nulla laboriosam labore doloremque commodi dolorem odit dolores, voluptatem.",
      copy: "© 2015 - Trendolizer pro. All rights reserved."
    }
  };
}

export default connect(mapStateToProps)(Auth);