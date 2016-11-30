import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Assigment extends React.Component {

  render() {
    return (this.props.item && this.props.params.assigment) ? (
      <div>Alerts column assigment</div>
    ) : null;
  }
}

let mapStateToProps = ({ alerts, columns }, ownProps) => ({
  columns: _.map(columns, (item)=>_.pick(item, ['id', 'name'])),
  item: _.filter(alerts, {id: parseInt(ownProps.params.id)})[0]
});

export default connect(mapStateToProps)(Assigment);