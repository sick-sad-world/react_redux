import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Edit extends React.Component {

  render() {
    if (!this.props.item.length) return null;
    console.log('Report edit update');
    return (
      <div>Reports edit form</div>
    );
  }
}

let mapStateToProps = ({ reports }, ownProps) => ({
  item: _.filter(reports, {id: parseInt(ownProps.params.id)})
});

export default connect(mapStateToProps)(Edit);