import { pick } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class UserBlock extends React.Component {

  render () {
    return (
      <div className='mod-user-block' id='funHeaderUser'>
        <img src={ this.props.image } alt={ this.props.fullname } />
        <div className='t-ellipsis'>
          <h2>{ this.props.fullname }</h2>
          <small>{ this.props.position }</small>
        </div>
      </div>
    );
  }
}

let mapStateToProps = ({user}) => pick(user, ['fullname', 'image', 'position']);

export default connect(mapStateToProps)(UserBlock);

