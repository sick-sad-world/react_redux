import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Edit extends React.Component {

  render() {
    if (!this.props.item.length) return null;
    console.log('Alert edit update');
    return (
      <div>Alerts edit form</div>
    );
  }
}

let mapStateToProps = ({ alerts }, ownProps) => ({
  item: _.filter(alerts, {id: parseInt(ownProps.params.id)})
});

export default connect(mapStateToProps)(Edit);