import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Assigment extends React.Component {

  render() {
    return (this.props.item && this.props.params.assigment) ? (
      <div>Reports column assigment</div>
    ) : null;
  }
}

let mapStateToProps = ({ reports, columns }, ownProps) => ({
  columns: _.map(columns, (item) => _.pick(item, ['id', 'name'])),
  item: _.filter(reports, {id: parseInt(ownProps.params.id)})[0]
});

export default connect(mapStateToProps)(Assigment);