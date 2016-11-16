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
      <form action="login" onSubmit={this.props.handler}>
        <h3>Log in</h3>
        <div className="row">
          <input type="text" name="username" placeholder="Your login" required pattern="^[a-zA-Z_-]+$" disabled={this.props.pending} />
        </div>
        <div className="row-flex">
          <input type="password" name="password" placeholder="Your password" required pattern="^[0-9a-zA-Z_-]{3,12}$" disabled={this.props.pending} />
          <input type="submit" className="is-alt" value="Log in" disabled={this.props.pending} />
        </div>
      </form>
    );
  }
}