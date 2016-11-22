import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Assigment extends React.Component {

  render() {
    if (!this.props.item.length && !this.props.params.assigment) return null;
    console.log('Report assigment update');
    return (
      <div>Reports column assigment</div>
    );
  }
}

let mapStateToProps = ({ reports, columns }, ownProps) => ({
  columns: _.map(columns, (item) => _.pick(item, ['id', 'name'])),
  item: _.filter(reports, {id: parseInt(ownProps.params.id)})
});

export default connect(mapStateToProps)(Assigment);