import React from "react";

export default class FormReg extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    return (
      <form action="create" onSubmit={this.props.handler}>
        <h3>New to Trendolizer?</h3>
        <div className="row">
          <input type="text" name="username" placeholder="Your login" required pattern="^[a-zA-Z_-]+$" disabled={this.props.pending} />
        </div>
        <div className="row">
          <input type="email" name="email" placeholder="Your email" required disabled={this.props.pending} />
        </div>
        <div className="row">
          <input type="password" name="password" placeholder="Your password" required pattern="^[0-9a-zA-Z_-]{3,12}$" disabled={this.props.pending} />
        </div>
        <div className="row">
          <input type="submit" className="is-alt" value="Create account" required disabled={this.props.pending} />
        </div>
      </form>
    );
  }
}