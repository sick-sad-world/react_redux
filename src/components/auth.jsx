import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { login } from "../actions/auth";

class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
    
    this.props= {
      title: "Welcome to Trendolizer pro.",
      subTitle: "Best engine for searching viral content.",
      descr: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis obcaecati, modi nesciunt voluptas distinctio amet doloribus dignissimos. Aut quod atque, dolor facere eum pariatur laboriosam iusto magnam quaerat, dolores quisquam eius animi possimus, minima, accusantium delectus non. Ipsum placeat optio, dignissimos nulla laboriosam labore doloremque commodi dolorem odit dolores, voluptatem.",
      copy: "© 2015 - Trendolizer pro. All rights reserved."
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleAuth(e) {
    e.preventDefault();
    this.props.dispatch(login({
      username: this.state.username,
      password: this.state.password
    }));
  }

  render() {
    return (
      <section className="screen-auth mod-authentification" id="funAuthScreen">
        <article className="welcome-text">
          <img className="logotype" src="img/logo.svg" title="Trendolier pro" alt="Trendolizer pro" />
          <hgroup className="t-rhythm">
            <h1 className="t-gutter">{ this.props.title }</h1>
            <h2 className="t-gutter">{ this.props.subtitle }</h2>
          </hgroup>
          <p className="t-rhythm">{ this.props.descr }</p>
          <small className="copyright">{ this.props.copy }</small>
        </article>
        <div className="auth-forms">
          <form action="login" onSubmit={this.handleAuth}>
            <h3>Log in</h3>
            <div className="row">
              <input type="text" name="username" placeholder="Your login" value={this.state.username} onChange={this.handleChange} />
            </div>
            <div className="row-flex">
              <input type="password" name="password" placeholder="Your password" value={this.state.password} onChange={this.handleChange} />
              <input type="submit" className="is-alt" value="Log in" />
            </div>
            <div className="row form-description">
              <a href="" className="is-rev">Forgot password?</a>
            </div>
          </form>
          <form action="create">
            <h3>New to Trendolizer?</h3>
            <div className="message"></div>
            <div className="row">
              <input type="text" name="username" placeholder="Your login" />
            </div>
            <div className="row">
              <input type="email" name="email" placeholder="Your email" />
            </div>
            <div className="row">
              <input type="password" name="password" placeholder="Your password" />
            </div>
            <div className="row">
              <input type="password" name="password2" placeholder="Retype password" />
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
  return {};
}

export default connect(mapStateToProps)(Auth);