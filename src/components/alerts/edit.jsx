import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Edit extends React.Component {

  render() {
    console.log('Alert edit update');
    return (
      <div>Alerts edit form</div>
    );
  }
}

let mapStateToProps = ({ alerts }, ownProps) => ({
  item: _.filter(alerts, {id: ownProps.location.query.id})
});

export default connect(mapStateToProps)(Edit);