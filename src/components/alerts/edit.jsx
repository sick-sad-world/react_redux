import { filter } from 'lodash';
import React from 'React';
import PageEdit from '../pageEdit';
import { connect } from 'react-redux';

class Edit extends React.Component {
  render() {
    return (
      <PageEdit item={this.props.item}></PageEdit>
    );
  }
}

let mapStateToProps = ({ alerts }, ownProps) => ({
  item: filter(alerts, {id: parseInt(ownProps.params.id)})
});

export default connect(mapStateToProps)(Edit);