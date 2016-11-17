import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class UserBlock extends React.Component {

  render () {
    return (
      <div className="mod-user-block" id="funHeaderUser">
        <img src={ this.props.image } alt={ this.props.fullname } />
        <div className="t-ellipsis">
          <h2>{ this.props.fullname }</h2>
          <small>{ this.props.position }</small>
        </div>
      </div>
    );
  }
}

export default connect((state) => _.pick(state.user, ["fullname", "image", "position"]))(UserBlock);

