import { filter, map, pick } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Assigment extends React.Component {
  render() {
    return (this.props.item && this.props.params.assigment) ? (
      <div>Columns sources assigment</div>
    ) : null;
  }
}

let mapStateToProps = ({ columns, sources }, ownProps) => ({
  sources: map(sources, (item) => pick(item, ['id', 'name', 'source_ids'])),
  item: filter(columns, {id: parseInt(ownProps.params.id)})[0]
});

export default connect(mapStateToProps)(Assigment);