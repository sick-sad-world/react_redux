import React from "react";

export default class FormLogin extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      pending: false
    };
  }
  render () {
    return (
      <form action="login" onSubmit={this.handler}>
        <h3>Log in</h3>
        <div className="row">
          <input type="text" name="login" placeholder="Your login" disabled={this.state.pending} value={this.state.login} onChange={this.handleChange} />
        </div>
        <div className="row-flex">
          <input type="password" name="pass" placeholder="Your password" disabled={this.state.pending} value={this.state.pass} onChange={this.handleChange} />
          <input type="submit" disabled={this.state.pending} className="is-alt" value="Log in" />
        </div>
      </form>
    );
  }
}