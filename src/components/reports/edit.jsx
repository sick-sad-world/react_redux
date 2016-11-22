import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Edit extends React.Component {

  render() {
    console.log('Report edit update');
    return (
      <div>Reports edit form</div>
    );
  }
}

let mapStateToProps = ({ reports }, ownProps) => ({
  item: _.filter(reports, {id: ownProps.location.query.id})
});

export default connect(mapStateToProps)(Edit);