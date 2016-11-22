import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Assigment extends React.Component {

  render() {
    console.log('Column assigment update');
    return (
      <div>Columns sources assigment</div>
    );
  }
}

let mapStateToProps = ({ columns, sources }, ownProps) => ({
  sources: _.map(sources, (item) => _.pick(item, ['id', 'name', 'source_ids'])),
  item: _.filter(columns, {id: ownProps.location.query.id})
});

export default connect(mapStateToProps)(Assigment);