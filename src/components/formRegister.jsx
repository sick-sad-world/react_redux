import React from "react";

export default class FormReg extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      pending: false
    };
  }
  render () {
    return (
      <form action="create" onSubmit={this.handler}>
        <h3>New to Trendolizer?</h3>
        <div className="message"></div>
        <div className="row">
          <input type="text" name="username" placeholder="Your login" disabled={this.state.pending} value={this.state.username} onChange={this.handleChange} />
        </div>
        <div className="row">
          <input type="email" name="email" placeholder="Your email" disabled={this.state.pending} value={this.state.email} onChange={this.handleChange} />
        </div>
        <div className="row">
          <input type="password" name="password" placeholder="Your password" disabled={this.state.pending} value={this.state.password} onChange={this.handleChange} />
        </div>
        <div className="row">
          <input type="submit" disabled={this.state.pending} className="is-alt" value="Create account" />
        </div>
      </form>
    );
  }
}