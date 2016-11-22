import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Edit extends React.Component {

  render() {
    if (!this.props.item.length) return null;
    console.log('Column edit update');
    return (
      <div>Columns edit form</div>
    );
  }
}

let mapStateToProps = ({ columns }, ownProps) => ({
  item: _.filter(columns, {id: parseInt(ownProps.params.id)})
});

export default connect(mapStateToProps)(Edit);