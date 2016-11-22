import { filter, contains } from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class Edit extends React.Component {

  render() {
    if (!this.props.item.length) return null;
    console.log('Sourceset edit update');
    return (
      <div>Sourceset edit form</div>
    );
  }
}

let mapStateToProps = ({ sourcesets, sources }, ownProps) => {
  let item = filter(sourcesets, {id: parseInt(ownProps.params.id)});
  return {
    item: item,
    sources: (item.length) ? filter(sources, (source) => item.source_ids.indexOf(source.id) > -1) : false
  };
};

export default connect(mapStateToProps)(Edit);